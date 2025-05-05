import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { transcript, prompt, interviewType, scores, justifications, feedback } = await request.json();
    
    const interview = await db.interview.create({
      data: {
        transcript,
        prompt,
        interviewType,
        scores: JSON.stringify(scores),
        justifications: JSON.stringify(justifications),
        feedback,
      },
    });

    return NextResponse.json({ id: interview.id });
  } catch (error) {
    console.error('Failed to store interview:', error);
    return NextResponse.json(
      { error: 'Failed to store interview' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Interview ID is required' },
        { status: 400 }
      );
    }

    const interview = await db.interview.findUnique({
      where: { id: parseInt(id) },
    });

    if (!interview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      transcript: interview.transcript,
      prompt: interview.prompt,
      interviewType: interview.interviewType,
      scores: JSON.parse(interview.scores),
      justifications: JSON.parse(interview.justifications),
      feedback: interview.feedback,
    });
  } catch (error) {
    console.error('Failed to retrieve interview:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve interview' },
      { status: 500 }
    );
  }
} 