import { GoogleGenerativeAI } from "@google/generative-ai";
import { Redis } from "@upstash/redis";
import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;

async function rateLimit(ip: string) {
  const key = `rateLimit:${ip}`;
  const count = await redis.incr(key);
  if (count > RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  await redis.expire(key, RATE_LIMIT_WINDOW / 1000);
  return true;
}

export async function POST(req: Request) {
  try {
    // Get the token using next-auth/jwt
    const token = await getToken({ req: req as unknown as NextApiRequest });
    
    if (!token) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Unauthorized'
      }), { status: 401 });
    }

    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(/, /)[0] : "unknown";
    
    if (!(await rateLimit(ip))) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Too many requests'
      }), { status: 429 });
    }

    const body = await req.json();
    let title = body.title;

    if (!title || typeof title !== "string" || title.length > 100) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid title'
      }), { status: 400 });
    }

    title = title.trim();
    const cacheKey = `roadmap:${title.toLowerCase()}`;

    // Check cache
    const cachedRoadmap = await redis.get(cacheKey);
    if (cachedRoadmap) {
      return new Response(JSON.stringify({
        success: true,
        data: typeof cachedRoadmap === "string" ? JSON.parse(cachedRoadmap) : cachedRoadmap
      }));
    }

    // Generate new roadmap
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
        
        Create a detailed and structured learning roadmap for ${title} with the following hierarchical structure:

1. **Main Topics**: Divide the roadmap into high-level main topics that cover the core areas of ${title}. Each main topic should represent a significant area of study.

2. **Sub-Topics**: For each main topic, break it down into sub-topics that represent smaller, more focused areas of learning. These sub-topics should be connected to their respective main topics.

3. **Resources**: For each sub-topic, provide a list of high-quality, free learning resources, including:
   - Documentation
   - Video tutorials
   - Articles
   - Online courses

4. **Projects**: Suggest practical projects for each sub-topic to reinforce learning. Include:
   - Project title
   - Description
   - Requirements

5. **Prerequisites**: List the prerequisites for each main topic and sub-topic to ensure proper progression.

6. **Connections**: Clearly define the connections between main topics and sub-topics, as well as between sub-topics and resources/projects. Use a node-based structure to represent these relationships.

7. **Output Format**: Return the roadmap in the following JSON structure:
   {
     "mainTopics": [
       {
         "id": "string", // Unique ID for the main topic
         "title": "string", // Title of the main topic
         "description": "string", // Brief description of the main topic
         "prerequisites": ["string"], // Prerequisites for the main topic
         "subTopics": [
           {
             "id": "string", // Unique ID for the sub-topic
             "title": "string", // Title of the sub-topic
             "description": "string", // Brief description of the sub-topic
             "prerequisites": ["string"], // Prerequisites for the sub-topic
             "resources": [
               {
                 "title": "string", // Title of the resource
                 "type": "documentation|video|tutorial|article", // Type of resource
                 "url": "string", // URL to the resource
                 "source": "string" // Source of the resource (e.g., YouTube, freeCodeCamp)
               }
             ],
             "projects": [
               {
                 "title": "string", // Title of the project
                 "description": "string", // Brief description of the project
                 "requirements": ["string"] // Requirements to complete the project
               }
             ]
           }
         ]
       }
     ],
     "connections": [
       {
         "source": "string", // ID of the source node (e.g., main topic or sub-topic)
         "target": "string" // ID of the target node (e.g., sub-topic or resource)
       }
     ]
   }

8. **Additional Instructions**:
   - Ensure the roadmap is well-structured and easy to follow.
   - Include only high-quality, free learning resources.
   - Provide a logical progression from beginner to advanced topics.
   - Add connections between related sub-topics to show interdependencies.
   - Include real-world projects to make the roadmap practical and actionable.

Example for ${title} = "Machine Learning":
- Main Topic: "Supervised Learning"
  - Sub-Topic: "Linear Regression"
    - Resources: Documentation, Video Tutorials, Articles
    - Projects: Predict House Prices
  - Sub-Topic: "Logistic Regression"
    - Resources: Documentation, Video Tutorials, Articles
    - Projects: Classify Iris Flowers
- Main Topic: "Unsupervised Learning"
  - Sub-Topic: "Clustering"
    - Resources: Documentation, Video Tutorials, Articles
    - Projects: Customer Segmentation
  - Sub-Topic: "Dimensionality Reduction"
    - Resources: Documentation, Video Tutorials, Articles
    - Projects: PCA on MNIST Dataset
- Connections:
  - "Supervised Learning" -> "Linear Regression"
  - "Supervised Learning" -> "Logistic Regression"
  - "Unsupervised Learning" -> "Clustering"
  - "Unsupervised Learning" -> "Dimensionality Reduction"
        
        `;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean and parse the response
    const cleanedResponse = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    
    const roadmap = JSON.parse(cleanedResponse);

    // Validate the roadmap structure
    if (!roadmap.mainTopics || !Array.isArray(roadmap.mainTopics) || roadmap.mainTopics.length === 0) {
      throw new Error('Invalid roadmap structure');
    }

    // Cache the roadmap
    await redis.set(cacheKey, JSON.stringify(roadmap), {
      ex: 24 * 60 * 60, // 24 hours
    });

    return new Response(JSON.stringify({
      success: true,
      data: roadmap
    }));

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Error generating roadmap'
    }), { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const body = await req.json();
    const cacheKey = `roadmap:${body.title.toLowerCase()}`;
    const cachedRoadmap = await redis.get(cacheKey);
    
    if (cachedRoadmap) {
      return new Response(JSON.stringify({
        success: true,
        data: typeof cachedRoadmap === "string" ? JSON.parse(cachedRoadmap) : cachedRoadmap
      }));
    }
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Roadmap not found'
    }), { status: 404 });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch roadmap'
    }), { status: 500 });
  }
}
