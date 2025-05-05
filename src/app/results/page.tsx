"use client";

import { useSearchParams } from "next/navigation";
import { RubricResult } from "../../components/RubricResult";
import { rubrics } from "../../data/rubrics";
import { DebugChat } from "../../components/debug-chat";
import { useEffect, useState } from "react";

interface InterviewData {
  transcript: string;
  prompt: string;
  interviewType: string;
  scores: number[];
  justifications: string[];
  feedback: string;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const error = searchParams.get("error");
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setLoading(false);
      switch (error) {
        case 'missing_data':
          setErrorMessage('The interview data is incomplete. Please try another interview.');
          break;
        case 'processing_failed':
          setErrorMessage('Failed to process the interview. Please try again.');
          break;
        case 'conversation_error':
          setErrorMessage('An error occurred during the interview. Please try again.');
          break;
        default:
          setErrorMessage('An unknown error occurred. Please try again.');
      }
      return;
    }

    if (id) {
      fetch(`/api/interviews?id=${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch interview data');
          }
          return response.json();
        })
        .then(data => {
          setInterviewData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching interview:', error);
          setErrorMessage('Failed to load interview results. Please try again.');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id, error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading interview results...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{errorMessage}</p>
          <a 
            href="/" 
            className="text-blue-500 hover:text-blue-700"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  if (!interviewData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No interview data found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-black">Interview Results</h1>
          <p className="text-gray-600">Review your performance and see how you can improve.</p>
        </div>
        {interviewData.feedback && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-2 text-black">Overall Feedback</h2>
            <p className="text-gray-700">{interviewData.feedback}</p>
          </div>
        )}
        <RubricResult 
          interviewType={interviewData.interviewType as keyof typeof rubrics}
          userScores={interviewData.scores}
          justifications={interviewData.justifications}
        />
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6 text-black">Interview Details</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-3 text-black">Interview Prompt</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{interviewData.prompt}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-3 text-black">Interview Transcript</h3>
              <div className="space-y-4">
                {interviewData.transcript.split('\n').map((line, index) => (
                  <p key={index} className="text-gray-700 whitespace-pre-wrap">{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6 text-black">Ask Questions About Your Interview</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <DebugChat 
              transcript={interviewData.transcript}
              interviewPrompt={interviewData.prompt}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 