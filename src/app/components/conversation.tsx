'use client';

import { useConversation, Role } from '@11labs/react';
import { useCallback, useState } from 'react';
import { Timer } from './timer';
import { useRouter } from 'next/navigation';

interface ConversationProps {
  agentId: string;
}

interface Message {
  message: string;
  source: Role;
}

export function Conversation({ agentId }: ConversationProps) {
  const router = useRouter();
  const [transcript, setTranscript] = useState<string[]>([]);
  const [interviewPrompt, setInterviewPrompt] = useState<string>('');

  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: async () => {
      console.log('Disconnected');
      // Only proceed with evaluation if the interview was actually ended by the user
      if (conversation.status === 'disconnected') {
        try {
          // Wait a moment to ensure all state updates are complete
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const fullTranscript = transcript.join('\n');
          console.log('Full transcript before redirect:', fullTranscript);
          console.log('Interview prompt before redirect:', interviewPrompt);
          
          if (!fullTranscript || !interviewPrompt) {
            console.error('Missing transcript or prompt:', { fullTranscript, interviewPrompt });
            // Still redirect to results page but with an error state
            router.push('/results?error=missing_data');
            return;
          }

          // First, get the evaluation
          const evaluationResponse = await fetch('/api/evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              transcript: fullTranscript,
              interviewType: agentId === "Ykg1OlS7H58nquphXgmt" ? "product-sense" : "critical-analytical"
            }),
          });
          const evaluationData = await evaluationResponse.json();

          // Then, store the interview data
          const interviewResponse = await fetch('/api/interviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transcript: fullTranscript,
              prompt: interviewPrompt,
              interviewType: agentId === "Ykg1OlS7H58nquphXgmt" ? "product-sense" : "critical-analytical",
              scores: evaluationData.scores,
              justifications: evaluationData.justifications,
              feedback: evaluationData.overall_feedback
            }),
          });
          const { id } = await interviewResponse.json();

          // Redirect to results page with interview ID
          router.push(`/results?id=${id}`);
        } catch (error) {
          console.error('Failed to process interview:', error);
          router.push('/results?error=processing_failed');
        }
      }
    },
    onMessage: (message: Message) => {
      console.log('Message:', message);
      // Save the first message as the interview prompt
      if (transcript.length === 0 && message.source === 'ai') {
        setInterviewPrompt(message.message);
        console.log('Setting interview prompt:', message.message);
      }
      // Add both user and AI messages to transcript
      setTranscript(prev => {
        const newTranscript = [...prev, message.message];
        console.log('Updated transcript:', newTranscript);
        return newTranscript;
      });
    },
    onError: (error) => {
      console.error('Error:', error);
      // Handle errors by redirecting to results page with error state
      router.push('/results?error=conversation_error');
    },
  });

  const startConversation = useCallback(async () => {
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices are not supported in this browser');
      }

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start the conversation with your agent
      try {
        await conversation.startSession({
          agentId: agentId,
        });
      } catch (sessionError: unknown) {
        console.error('Session start error:', sessionError);
        const errorMessage = sessionError instanceof Error ? sessionError.message : 'Unknown error';
        throw new Error(`Failed to start session: ${errorMessage}`);
      }

    } catch (error) {
      console.error('Failed to start conversation:', error);
      // Show more detailed error message
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('An unknown error occurred while starting the conversation');
      }
    }
  }, [conversation, agentId]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl p-6 bg-white rounded-xl shadow-md">
      <div className="flex items-center justify-between w-full">
        <Timer 
          isActive={conversation.status === 'connected'} 
          estimatedDuration="40 minutes"
        />
        <div className="flex gap-2">
          <button
            onClick={startConversation}
            disabled={conversation.status === 'connected'}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Start Interview
          </button>
          <button
            onClick={stopConversation}
            disabled={conversation.status !== 'connected'}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            End Interview
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 w-full">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${conversation.status === 'connected' ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span className="text-sm text-gray-600">
            {conversation.status === 'connected' ? 'Interview in progress' : 'Ready to start'}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          {conversation.isSpeaking ? 'Interviewer is speaking...' : 'Listening for your response...'}
        </p>
      </div>
    </div>
  );
}
