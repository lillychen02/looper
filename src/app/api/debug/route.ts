import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { question, transcript, interviewPrompt, conversationHistory } = await request.json();

    const prompt = `
You are helping debug a product sense interview. Here is the context:

Interview Prompt: ${interviewPrompt}

Interview Transcript: ${transcript}

Previous Conversation: ${JSON.stringify(conversationHistory)}

Question: ${question}

Please provide a helpful answer that:
1. References specific parts of the interview transcript when relevant
2. Explains any inconsistencies or issues you notice
3. Provides suggestions for improvement
4. Keeps the context of the specific interview in mind

Answer:`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const answer = completion.choices[0].message.content;
    if (!answer) {
      throw new Error('No response from AI');
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: 'Failed to process debug question' },
      { status: 500 }
    );
  }
} 