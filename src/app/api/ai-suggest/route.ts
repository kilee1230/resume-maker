// app/api/ai-suggest/route.ts
import { NextResponse } from "next/server";
import { ResumeData } from "@/types/resume";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { resumeData, field } = (await request.json()) as {
      resumeData: ResumeData;
      field: string;
    };

    let prompt = "";

    if (field === "summary") {
      prompt = `Create a professional summary for a ${
        resumeData.experiences[0]?.title || "professional"
      }. 
      Include skills: ${resumeData.skills.map((s) => s.name).join(", ")}.
      Keep it concise and impactful, around 3-4 sentences.`;
    } else if (field.startsWith("experience-")) {
      const index = parseInt(field.split("-")[1]);
      const exp = resumeData.experiences[index];
      prompt = `Write a compelling bullet-point style description for this job position:
      Job Title: ${exp.title}
      Company: ${exp.company}
      Highlight achievements and responsibilities. Use strong action verbs. Keep it to 3-4 sentences.`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume writer who helps create professional resume content.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const suggestion = completion.choices[0]?.message?.content?.trim() || "";

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Error generating AI suggestion" },
      { status: 500 }
    );
  }
}
