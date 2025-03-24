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

function normalizeTopicNumbers(roadmapData: any) {
  let counter = 1;
  
  ['fundamentalTopics', 'beginnerTopics', 'intermediateTopics', 'advancedTopics'].forEach(level => {
    if (Array.isArray(roadmapData[level])) {
      roadmapData[level] = roadmapData[level].map(topic => ({
        ...topic,
        stepNumber: counter++
      }));
    }
  });
  
  return roadmapData;
}

const projectPromptStructure = `
For each project, include the following specific details:
{
  "title": "Project name",
  "description": "Detailed project description",
  "difficulty": "Beginner|Intermediate|Advanced",
  "skillLevel": "Beginner|Intermediate|Advanced",
  "estimatedHours": number (realistic hours to complete),
  "timeEstimate": "X-Y weeks/days" (human-readable format),
  "prerequisites": [
    "Required skill 1",
    "Required skill 2",
    "Required technology/tool"
  ],
  "learningOutcomes": [
    "What you'll learn 1",
    "What you'll learn 2"
  ],
  "steps": [
    "Detailed step-by-step implementation guide"
  ],
  "challengeLevel": 1-5 (1 being easiest, 5 being most challenging),
  "resources": {
    "documentation": [{"title": "string", "url": "string"}],
    "tutorials": [{"title": "string", "url": "string"}],
    "githubRepos": [{"title": "string", "url": "string"}]
  }
}

Guidelines for time estimates:
- Beginner projects: 2-10 hours
- Intermediate projects: 10-30 hours
- Advanced projects: 30-80 hours

Prerequisites should include:
1. Required programming languages
2. Required frameworks/libraries
3. Required concepts/knowledge
4. Required tools/environments
`;

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    if (!title) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    // Normalize the title consistently
    const normalizedTitle = title.toLowerCase().trim().replace(/\s+/g, '-');
    const cacheKey = `roadmap:${normalizedTitle}`;
    const cachedRoadmap = await redis.get(cacheKey);

    if (cachedRoadmap) {
      return NextResponse.json({
        success: true,
        data: typeof cachedRoadmap === "string" ? JSON.parse(cachedRoadmap) : cachedRoadmap,
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Create a detailed and structured learning roadmap for ${title} with the following hierarchical structure:

1. **Fundamental Topics**: Start by identifying the foundational concepts and principles that are essential for understanding ${title}. These topics should provide a strong base for beginners.

2. **Beginner Topics**: Break down the fundamental topics into beginner-level subtopics. These should introduce basic concepts, terminology, and simple applications.

3. **Intermediate Topics**: Build on the beginner topics by introducing more complex concepts, tools, and techniques. These topics should bridge the gap between basic and advanced knowledge.

4. **Advanced Topics**: Cover advanced concepts, specialized techniques, and real-world applications. These topics should prepare the user to master ${title}.

5. **Projects and Practical Applications**: For each level (beginner, intermediate, advanced), include practical projects that reinforce learning. Each project should have:
   - A clear title and description.
   - A list of skills and concepts it covers.
   - Step-by-step instructions.
   - Expected outcomes.

6. **Resources**: For each topic, provide high-quality, free learning resources, including:
   - **Documentation**: Official or community-driven documentation.
   - **GitHub Repositories**: Open-source projects, code examples, and templates.
   - **Articles**: In-depth guides, tutorials, and blog posts.

7. **Prerequisites**: Clearly list prerequisites for each topic to ensure a logical progression.

8. **Connections**: Define relationships between topics to show how they build on each other.

9. **Output Format**: Return the roadmap in the following JSON structure:

\`\`\`json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "fundamentalTopics": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "keyConcepts": ["string"],
      "resources": {
        "documentation": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ],
        "githubRepos": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ],
        "articles": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ]
      }
    }
  ],
  "beginnerTopics": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "keyConcepts": ["string"],
      "resources": {
        "documentation": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ],
        "githubRepos": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ],
        "articles": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ]
      },
      "projects": [
        {
          "id": "string",
          "title": "string",
          "description": "string",
          "skills": ["string"],
          "steps": ["string"],
          "expectedOutcome": "string"
        }
      ]
    }
  ],
  "intermediateTopics": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "keyConcepts": ["string"],
      "resources": {
        "documentation": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ],
        "githubRepos": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ],
        "articles": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ]
      },
      "projects": [
        {
          "id": "string",
          "title": "string",
          "description": "string",
          "skills": ["string"],
          "steps": ["string"],
          "expectedOutcome": "string"
        }
      ]
    }
  ],
  "advancedTopics": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "keyConcepts": ["string"],
      "resources": {
        "documentation": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ],
        "githubRepos": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ],
        "articles": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ]
      },
      "projects": [
        {
          "id": "string",
          "title": "string",
          "description": "string",
          "skills": ["string"],
          "steps": ["string"],
          "expectedOutcome": "string"
        }
      ]
    }
  ],
  "learningPath": {
    "beginner": {
      "duration": "string",
      "milestones": ["string"],
      "projects": ["string"]
    },
    "intermediate": {
      "duration": "string",
      "milestones": ["string"],
      "projects": ["string"]
    },
    "advanced": {
      "duration": "string",
      "milestones": ["string"],
      "projects": ["string"]
    }
  }
}
\`\`\`;

For each topic, include practical projects that follow this structure:
${projectPromptStructure}
`;
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    try {
      // Remove any markdown formatting before parsing
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      const roadmap = JSON.parse(cleanResponse);
      
      // Basic validation of required fields
      if (!roadmap.title || !roadmap.fundamentalTopics || !roadmap.beginnerTopics) {
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

    // Normalize the title consistently with how it's stored
    const normalizedTitle = title.toLowerCase().trim().replace(/\s+/g, '-');
    const cacheKey = `roadmap:${normalizedTitle}`;
    const cachedRoadmap = await redis.get(cacheKey);

    if (cachedRoadmap) {
      return NextResponse.json({
        success: true,
        data: typeof cachedRoadmap === "string" 
          ? JSON.parse(cachedRoadmap) 
          : cachedRoadmap,
      });
    }

    // If not in cache, generate new roadmap
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Create a detailed and structured learning roadmap for ${title} with the following hierarchical structure:

1. **Fundamental Topics**: Start by identifying the foundational concepts and principles that are essential for understanding ${title}. These topics should provide a strong base for beginners.

2. **Beginner Topics**: Break down the fundamental topics into beginner-level subtopics. These should introduce basic concepts, terminology, and simple applications.

3. **Intermediate Topics**: Build on the beginner topics by introducing more complex concepts, tools, and techniques. These topics should bridge the gap between basic and advanced knowledge.

4. **Advanced Topics**: Cover advanced concepts, specialized techniques, and real-world applications. These topics should prepare the user to master ${title}.

5. **Projects and Practical Applications**: For each level (beginner, intermediate, advanced), include practical projects that reinforce learning. Each project should have:
   - A clear title and description.
   - A list of skills and concepts it covers.
   - Step-by-step instructions.
   - Expected outcomes.

6. **Resources**: For each topic, provide high-quality, free learning resources, including:
   - **Documentation**: Official or community-driven documentation.
   - **GitHub Repositories**: Open-source projects, code examples, and templates.
   - **Articles**: In-depth guides, tutorials, and blog posts.

7. **Prerequisites**: Clearly list prerequisites for each topic to ensure a logical progression.

8. **Connections**: Define relationships between topics to show how they build on each other.

9. **Output Format**: Return the roadmap in the following JSON structure:

\`\`\`json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "fundamentalTopics": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "keyConcepts": ["string"],
      "resources": {
        "documentation": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ],
        "githubRepos": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ],
        "articles": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ]
      }
    }
  ],
  "beginnerTopics": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "keyConcepts": ["string"],
      "resources": {
        "documentation": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ],
        "githubRepos": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ],
        "articles": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ]
      },
      "projects": [
        {
          "id": "string",
          "title": "string",
          "description": "string",
          "skills": ["string"],
          "steps": ["string"],
          "expectedOutcome": "string"
        }
      ]
    }
  ],
  "intermediateTopics": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "keyConcepts": ["string"],
      "resources": {
        "documentation": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ],
        "githubRepos": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ],
        "articles": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ]
      },
      "projects": [
        {
          "id": "string",
          "title": "string",
          "description": "string",
          "skills": ["string"],
          "steps": ["string"],
          "expectedOutcome": "string"
        }
      ]
    }
  ],
  "advancedTopics": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "keyConcepts": ["string"],
      "resources": {
        "documentation": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ],
        "githubRepos": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ],
        "articles": [
          {
            "title": "string",
            "url": "string",
            "description": "string"
          }
        ]
      },
      "projects": [
        {
          "id": "string",
          "title": "string",
          "description": "string",
          "skills": ["string"],
          "steps": ["string"],
          "expectedOutcome": "string"
        }
      ]
    }
  ],
  "learningPath": {
    "beginner": {
      "duration": "string",
      "milestones": ["string"],
      "projects": ["string"]
    },
    "intermediate": {
      "duration": "string",
      "milestones": ["string"],
      "projects": ["string"]
    },
    "advanced": {
      "duration": "string",
      "milestones": ["string"],
      "projects": ["string"]
    }
  }
}
\`\`\`;

For each topic, include practical projects that follow this structure:
${projectPromptStructure}
`;
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    console.log('Raw AI Response:', response);
    
    try {
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      const roadmap = JSON.parse(cleanResponse);
      
      console.log('Parsed Roadmap Data:', JSON.stringify(roadmap, null, 2));
      
      // Basic validation of required fields
      if (!roadmap.title || !roadmap.fundamentalTopics || !roadmap.beginnerTopics) {
        throw new Error("Invalid roadmap structure");
      }

      await redis.set(cacheKey, JSON.stringify(roadmap), { ex: 24 * 60 * 60 });
      return NextResponse.json({ success: true, data: roadmap });
    } catch (parseError) {
      console.error('AI Response parsing error:', parseError);
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
