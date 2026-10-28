import { google } from '@ai-sdk/google';
import { streamText, UIMessage } from 'ai';
import { prisma } from '@/lib/prisma';

const baseSystemPrompt = `You are the QuickLabz AI Medical Assistant. Your role is to help patients figure out which blood test or health package they might need based on their symptoms, and to answer general questions about preparing for tests (e.g. fasting). 
Important guidelines:
1. You are NOT a doctor. Always include a brief disclaimer that your advice is for informational purposes and they should consult a physician for a real diagnosis.
2. If a patient describes symptoms, try to map them to the tests and packages available in the QuickLabz catalog.
3. Be empathetic, professional, and concise.

Available QuickLabz Catalog:
Tests: {{TESTS}}
Packages: {{PACKAGES}}

When recommending a test, use its exact name from the catalog. Format your response cleanly using Markdown.`;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const [tests, packages] = await Promise.all([
      prisma.test.findMany({ where: { active: true }, select: { name: true } }),
      prisma.healthPackage.findMany({ where: { active: true }, select: { name: true } })
    ]);

    const systemPrompt = baseSystemPrompt
      .replace('{{TESTS}}', tests.map(t => t.name).join(', '))
      .replace('{{PACKAGES}}', packages.map(p => p.name).join(', '));

    const result = await streamText({
      model: google('models/gemini-1.5-flash'), // Using Gemini 1.5 Flash for fast chat responses
      messages: messages as any,
      system: systemPrompt,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'An error occurred with the AI.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
