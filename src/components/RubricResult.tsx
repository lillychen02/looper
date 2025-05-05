"use client";

import { rubrics } from "../data/rubrics";

type RubricItem = {
  criterion: string;
  emoji: string;
  scores: {
    score: number;
    description: string;
  }[];
};

type RubricResultProps = {
  interviewType: keyof typeof rubrics;
  userScores?: number[];
  justifications?: string[];
};

export function RubricResult({ interviewType, userScores, justifications }: RubricResultProps) {
  const rubric = rubrics[interviewType];

  if (!rubric) {
    return <div>No rubric available for this interview type.</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-6 text-black">Interview Rubric</h2>
      {rubric.map((item: RubricItem, idx: number) => (
        <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{item.emoji}</span>
            <h3 className="text-lg font-semibold text-black">{item.criterion}</h3>
            {userScores && (
              <span className="ml-auto px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                Score: {userScores[idx]}
              </span>
            )}
          </div>
          <div className="space-y-3">
            {item.scores.map((s) => (
              <div
                key={s.score}
                className={`p-3 rounded ${
                  userScores && userScores[idx] === s.score
                    ? "bg-green-50 border border-green-200"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-black">Score {s.score}:</span>
                  {userScores && userScores[idx] === s.score && (
                    <span className="text-green-600 text-sm">(Your Score)</span>
                  )}
                </div>
                <p className="text-gray-700">{s.description}</p>
                {justifications && userScores && userScores[idx] === s.score && (
                  <p className="mt-2 text-sm text-gray-600">
                    <strong>Feedback:</strong> {justifications[idx]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 