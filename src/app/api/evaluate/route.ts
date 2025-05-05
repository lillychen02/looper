import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { transcript, interviewType } = await request.json();

    const prompt = `
You are an expert PM interviewer evaluating a ${interviewType} interview. Your task is to evaluate the candidate's performance based ONLY on the provided transcript. Do not make assumptions or add information not present in the transcript.

Here is the rubric:

1. Clarify the Prompt (1-4):
   - Score 1: Jumped straight into solutions without asking clarifying questions. Didn't consider broader business context or user needs.
   - Score 2: Asked some clarifying questions but stayed at the surface. Limited consideration of business or product stage.
   - Score 3: Asked thoughtful clarifying questions, understood the core business problem, and surfaced success criteria.
   - Score 4: Framed the overarching vision, translated the problem into company-wide goals, and challenged assumptions when appropriate.

2. Understand Users and Their Problems (1-4):
   - Score 1: Lacked user empathy. Focused on one segment only or relied on personal experience without broad consideration.
   - Score 2: Identified some user segments and their needs but didn't go deep or broad. Missed edge cases or complexity.
   - Score 3: Clearly articulated multiple user segments and their pain points. Considered "day in the life" and jobs-to-be-done.
   - Score 4: Showed deep empathy, broke down complexity into primitives, and called out tradeoffs or unresolvable issues with elegance.

3. Explore and Prioritize Solutions (1-4):
   - Score 1: Presented ad-hoc ideas without structure. No clear prioritization or rationale behind solutions.
   - Score 2: Introduced a prioritization framework but used inconsistently. Limited user empathy in tradeoffs.
   - Score 3: Used structured thinking (e.g., 80/20, first principles) and identified tradeoffs thoughtfully.
   - Score 4: Considered multiple approaches with pros and cons, tied priorities to user problems, and did intuitive impact sizing.

4. Execute on an MVP (1-4):
   - Score 1: Couldn't scope an MVP. Provided vague or incomplete solution without addressing user needs clearly.
   - Score 2: Proposed a basic MVP, but lacked UX clarity or failed to justify scope.
   - Score 3: Delivered a scoped solution with thoughtful UX. Communicated tradeoffs and success metrics clearly.
   - Score 4: Delivered an elegant, delightful MVP. Prioritized well, simplified UX, scoped dependencies, and called out risks.

CRITICAL INSTRUCTIONS:
1. Base your evaluation SOLELY on the provided transcript. Do not make assumptions or add information not present in the transcript.
2. For each score and justification, quote specific parts of the transcript to support your evaluation.
3. If a particular aspect is not addressed in the transcript, note that in the justification rather than making assumptions.
4. The overall feedback should summarize the specific strengths and areas for improvement based on the actual interview content.
5. Do not reference companies, products, or features not mentioned in the transcript.

Here is the candidate's interview transcript:
${transcript}

For each rubric criterion, assign a score (1-4) and provide a specific justification based on the candidate's actual responses in this interview. Reference their specific answers and approach to the interview question. Respond in JSON format:
{
  "scores": [number, number, number, number],
  "justifications": [string, string, string, string],
  "overall_feedback": string
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('No response from AI');
    }

    const evaluation = JSON.parse(response);
    return NextResponse.json(evaluation);
  } catch (error) {
    console.error('Evaluation error:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate interview' },
      { status: 500 }
    );
  }
} 