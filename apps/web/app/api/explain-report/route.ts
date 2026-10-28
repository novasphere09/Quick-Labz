import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

const systemPrompt = `You are a medical AI assistant for QuickLabz. Your job is to take a patient's laboratory blood test findings and explain them in simple, layman-friendly language.
- Do NOT use complex medical jargon without explaining it simply.
- If everything is normal, reassure the patient.
- If something is out of range, gently explain what that marker means and advise them to consult their doctor. Do NOT diagnose them or cause panic.
- Keep the summary concise (2-3 short paragraphs max).
- Add a mandatory disclaimer at the end stating you are an AI assistant and this is not medical advice.`;

export async function POST(req: Request) {
  try {
    console.log("API KEY LOADED:", !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const { findings, testName } = await req.json();

    if (!findings || !Array.isArray(findings)) {
      return NextResponse.json({ error: 'Invalid findings data' }, { status: 400 });
    }

    const prompt = `Please explain the following lab report for the test: ${testName}\n\nFindings:\n${JSON.stringify(findings, null, 2)}`;

    const { text } = await generateText({
      model: google('models/gemini-1.5-flash'),
      system: systemPrompt,
      prompt: prompt,
    });

    return NextResponse.json({ summary: text });
  } catch (error: any) {
    console.error('Explain Report AI Error:', error);
    return NextResponse.json({ error: 'Failed to generate explanation.' }, { status: 500 });
  }
}
