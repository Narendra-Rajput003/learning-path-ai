import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { completedTopics } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate a quiz with 5 questions based on these topics: ${completedTopics.join(', ')}. 
    Format the response as a JSON object with this structure:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const quiz = JSON.parse(response);

    return NextResponse.json({ success: true, quiz });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}