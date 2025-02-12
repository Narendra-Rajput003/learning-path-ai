
import {GoogleGenerativeAI} from "@google/generative-ai"
import {Redis} from "@upstash/redis"
import rateLimit from "express-rate-limit"
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);


const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL!,
    token: process.env.UPSTASH_REDIS_TOKEN!,
})

const limiter = rateLimit({
 windowMs: 15 * 60 * 1000, // 15 minutes
 max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
})


export async function POST(req:NextRequest){
    try {
        const session = await getServerSession();
        if(!session?.user){
        return NextResponse.json(
            {
                error:"Not authenticated"
            },
            {
                status:401
            }
        )
        }

        /// rate limiting

        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const rateLimitResult = await limiter(ip)

        if(!rateLimitResult.success){
            return NextResponse.json(
                {error:"Too many requests"},
                {status:429}
            )
        }
        const body = await req.json();

        //check cache first 

        const cacheKey = `roadmap:${body.title.toLowerCase()}`;
        const cachedRoadmap = await redis.get(cacheKey);
        if(cachedRoadmap){
            return NextResponse.json(
                {roadmap:cachedRoadmap},
            )
        }

        const model = genAI.getGenerativeModel({
            model:"gemini-2.0-flash"
        })

        const prompt =`
        
        Create a detailed and structured learning roadmap for ${body.title} with the following hierarchical structure:

1. **Main Topics**: Divide the roadmap into high-level main topics that cover the core areas of ${body.title}. Each main topic should represent a significant area of study.

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

Example for ${body.title} = "Machine Learning":
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
        
        `

        const result = await model.generateContent(prompt);
        const response =  result.response;
        const roadmap = JSON.parse(response.text());


        ///cache the roadmap
        await redis.set(cacheKey, JSON.stringify(roadmap),{
            ex:24*60*60,
        });

        return NextResponse.json({roadmap})

    } catch (error) {
        console.error('Error generating roadmap:', error);
     return NextResponse.json(
      { error: 'Failed to generate roadmap' },
      { status: 500 }
    );
    }
}