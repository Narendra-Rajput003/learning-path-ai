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
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(/, /)[0] : "127.0.0.1";

    if (!(await rateLimit(ip))) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const { title } = await req.json();
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
        data: typeof cachedRoadmap === "string" ? JSON.parse(cachedRoadmap) : cachedRoadmap,
        cached: true
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    try {
      const roadmap = JSON.parse(response);
      await redis.set(cacheKey, JSON.stringify(roadmap), { ex: 24 * 60 * 60 });
      return NextResponse.json({ success: true, data: roadmap });
    } catch (error) {
      throw new Error("Invalid JSON response from AI model");
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
    const body = await req.json();
    const cacheKey = `roadmap:${body.title.toLowerCase()}`;
    const cachedRoadmap = await redis.get(cacheKey);

    if (cachedRoadmap) {
      return new Response(
        JSON.stringify({
          success: true,
          data:
            typeof cachedRoadmap === "string"
              ? JSON.parse(cachedRoadmap)
              : cachedRoadmap,
        })
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: "Roadmap not found",
      }),
      { status: 404 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch roadmap",
      }),
      { status: 500 }
    );
  }
}
