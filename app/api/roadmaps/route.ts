import { GoogleGenerativeAI } from "@google/generative-ai";
import { Redis } from "@upstash/redis";
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;

async function rateLimit(ip: string) {
  try {
    const key = `rateLimit:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, RATE_LIMIT_WINDOW / 1000);
    }
    return count <= RATE_LIMIT_MAX_REQUESTS;
  } catch (error) {
    console.error('Rate limiting error:', error);
    return true; // Fail open to prevent blocking legitimate requests
  }
}

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    if (!title) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    // Normalize the title for caching
    const normalizedTitle = title.toLowerCase().trim();
    const cacheKey = `roadmap:${normalizedTitle}`;
    const cachedRoadmap = await redis.get(cacheKey);

    if (cachedRoadmap) {
      return NextResponse.json({
        success: true,
        data: typeof cachedRoadmap === "string" ? JSON.parse(cachedRoadmap) : cachedRoadmap,
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = "Create a detailed and structured learning roadmap for " + title + " with the following hierarchical structure:\n" +
    "\n" +
    "1. **Fundamental Topics**: Start by identifying the foundational concepts and principles that are essential for understanding " + title + ". These topics should provide a strong base for beginners.\n" +
    "\n" +
    "2. **Beginner Topics**: Break down the fundamental topics into beginner-level subtopics. These should introduce basic concepts, terminology, and simple applications.\n" +
    "\n" +
    "3. **Intermediate Topics**: Build on the beginner topics by introducing more complex concepts, tools, and techniques. These topics should bridge the gap between basic and advanced knowledge.\n" +
    "\n" +
    "4. **Advanced Topics**: Cover advanced concepts, specialized techniques, and real-world applications. These topics should prepare the user to master " + title + ".\n" +
    "\n" +
    "5. **Projects and Practical Applications**: For each level (beginner, intermediate, advanced), include practical projects that reinforce learning. Each project should have:\n" +
    "   - A clear title and description.\n" +
    "   - A list of skills and concepts it covers.\n" +
    "   - Step-by-step instructions.\n" +
    "   - Expected outcomes.\n" +
    "\n" +
    "6. **Resources**: For each topic, provide high-quality, free learning resources, including:\n" +
    "   - **Documentation**: Official or community-driven documentation.\n" +
    "   - **GitHub Repositories**: Open-source projects, code examples, and templates.\n" +
    "   - **Articles**: In-depth guides, tutorials, and blog posts.\n" +
    "\n" +
    "7. **Prerequisites**: Clearly list prerequisites for each topic to ensure a logical progression.\n" +
    "\n" +
    "8. **Connections**: Define relationships between topics to show how they build on each other.\n" +
    "\n" +
    "9. **Output Format**: Return the roadmap in the following JSON structure:\n" +
    "\n" +
    "\`\`\`json\n" +
    "{\n" +
    '  "id": "string",\n' +
    '  "title": "string",\n' +
    '  "description": "string",\n' +
    '  "fundamentalTopics": [\n' +
    "    {\n" +
    '      "id": "string",\n' +
    '      "title": "string",\n' +
    '      "description": "string",\n' +
    '      "keyConcepts": ["string"],\n' +
    '      "resources": {\n' +
    '        "documentation": [\n' +
    "          {\n" +
    '            "title": "string",\n' +
    '            "url": "string",\n' +
    '            "description": "string"\n' +
    "          }\n" +
    "        ],\n" +
    '        "githubRepos": [\n' +
    "          {\n" +
    '            "title": "string",\n' +
    '            "url": "string",\n' +
    '            "description": "string"\n' +
    "          }\n" +
    "        ],\n" +
    '        "articles": [\n' +
    "          {\n" +
    '            "title": "string",\n' +
    '            "url": "string",\n' +
    '            "description": "string"\n' +
    "          }\n" +
    "        ]\n" +
    "      }\n" +
    "    }\n" +
    "  ],\n" +
    '  "beginnerTopics": [\n' +
    "    {\n" +
    '      "id": "string",\n' +
    '      "title": "string",\n' +
    '      "description": "string",\n' +
    '      "keyConcepts": ["string"],\n' +
    '      "resources": {\n' +
    '        "documentation": [\n' +
    "          {\n" +
    '            "title": "string",\n' +
    '            "url": "string",\n' +
    '            "description": "string"\n' +
    "          }\n" +
    "        ],\n" +
    '        "githubRepos": [\n' +
    "          {\n" +
    '            "title": "string",\n' +
    '            "url": "string",\n' +
    '            "description": "string"\n' +
    "          }\n" +
    "        ],\n" +
    '        "articles": [\n' +
    "          {\n" +
    '            "title": "string",\n' +
    '            "url": "string",\n' +
    '            "description": "string"\n' +
    "          }\n" +
    "        ]\n" +
    "      },\n" +
    '      "projects": [\n' +
    "        {\n" +
    '          "id": "string",\n' +
    '          "title": "string",\n' +
    '          "description": "string",\n' +
    '          "skills": ["string"],\n' +
    '          "steps": ["string"],\n' +
    '          "expectedOutcome": "string"\n' +
    "        }\n" +
    "      ]\n" +
    "    }\n" +
    "  ],\n" +
    '  "intermediateTopics": [\n' +
    "    {\n" +
    '      "id": "string",\n' +
    '      "title": "string",\n' +
    '      "description": "string",\n' +
    '      "keyConcepts": ["string"],\n' +
    '      "resources": {\n' +
    '        "documentation": [\n' +
    "          {\n" +
    '            "title": "string",\n' +
    '            "url": "string",\n' +
    '            "description": "string"\n' +
    "          }\n" +
    "        ],\n" +
    '        "githubRepos": [\n' +
    "          {\n" +
    '            "title": "string",\n' +
    '            "url": "string",\n' +
    '            "description": "string"\n' +
    "          }\n" +
    "        ],\n" +
    '        "articles": [\n' +
    "          {\n" +
    '            "title": "string",\n' +
    '            "url": "string",\n' +
    '            "description": "string"\n' +
    "          }\n" +
    "        ]\n" +
    "      },\n" +
    '      "projects": [\n' +
    "        {\n" +
    '          "id": "string",\n' +
    '          "title": "string",\n' +
    '          "description": "string",\n' +
    '          "skills": ["string"],\n' +
    '          "steps": ["string"],\n' +
    '          "expectedOutcome": "string"\n' +
    "        }\n" +
    "      ]\n" +
    "    }\n" +
    "  ],\n" +
    '  "advancedTopics": [\n' +
    "    {\n" +
    '      "id": "string",\n' +
    '      "title": "string",\n' +
    '      "description": "string",\n' +
    '      "keyConcepts": ["string"],\n' +
    '      "resources": {\n' +
    '        "documentation": [\n' +
    "          {\n" +
    '            "title": "string",\n' +
    '            "url": "string",\n' +
    '            "description": "string"\n' +
    "          }\n" +
    "        ],\n" +
    '        "githubRepos": [\n' +
    "          {\n" +
    '            "title": "string",\n' +
    '            "url": "string",\n' +
    '            "description": "string"\n' +
    "          }\n" +
    "        ],\n" +
    '        "articles": [\n' +
    "          {\n" +
    '            "title": "string",\n' +
    '            "url": "string",\n' +
    '            "description": "string"\n' +
    "          }\n" +
    "        ]\n" +
    "      },\n" +
    '      "projects": [\n' +
    "        {\n" +
    '          "id": "string",\n' +
    '          "title": "string",\n' +
    '          "description": "string",\n' +
    '          "skills": ["string"],\n' +
    '          "steps": ["string"],\n' +
    '          "expectedOutcome": "string"\n' +
    "        }\n" +
    "      ]\n" +
    "    }\n" +
    "  ],\n" +
    '  "learningPath": {\n' +
    '    "beginner": {\n' +
    '      "duration": "string",\n' +
    '      "milestones": ["string"],\n' +
    '      "projects": ["string"]\n' +
    "    },\n" +
    '    "intermediate": {\n' +
    '      "duration": "string",\n' +
    '      "milestones": ["string"],\n' +
    '      "projects": ["string"]\n' +
    "    },\n" +
    '    "advanced": {\n' +
    '      "duration": "string",\n' +
    '      "milestones": ["string"],\n' +
    '      "projects": ["string"]\n' +
    "    }\n" +
    "  }\n" +
    "}\n" +
    "\`\`\`;";
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    try {
      // Attempt to parse and validate the JSON structure
      const roadmap = JSON.parse(response);
      
      // Basic validation of required fields
      if (!roadmap.title || !roadmap.topics || !roadmap.learningPath) {
        throw new Error("Invalid roadmap structure");
      }

      await redis.set(cacheKey, JSON.stringify(roadmap), { ex: 24 * 60 * 60 });
      return NextResponse.json({ success: true, data: roadmap });
    } catch (parseError) {
      console.error('AI Response parsing error:', parseError);
      console.error('Raw AI response:', response);
      return NextResponse.json(
        { success: false, error: "Failed to generate valid roadmap" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title');
    
    if (!title) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    const cacheKey = `roadmap:${title.toLowerCase()}`;
    const cachedRoadmap = await redis.get(cacheKey);

    if (cachedRoadmap) {
      return NextResponse.json({
        success: true,
        data: typeof cachedRoadmap === "string" 
          ? JSON.parse(cachedRoadmap) 
          : cachedRoadmap,
      });
    }

    return NextResponse.json({
      success: false,
      error: "Roadmap not found",
    }, { status: 404 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    }, { status: 500 });
  }
}
