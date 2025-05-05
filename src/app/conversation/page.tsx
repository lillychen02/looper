"use client";

import { Conversation } from "../components/conversation";
import { useSearchParams } from "next/navigation";

const interviewTypes = {
  "Ykg1OlN7H58nquphXgmt": "Product Sense",
  "0vdorfV4DR2C8SZXJsLQ": "Critical Thinking"
};

export default function ConversationPage() {
  const searchParams = useSearchParams();
  const agentId = searchParams.get("agentId") || "Ykg1OlN7H58nquphXgmt"; // Default to Product Sense agent if not provided
  const currentInterviewType = interviewTypes[agentId as keyof typeof interviewTypes] || "Product Sense";

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="w-full bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-800">Interview: {currentInterviewType}</h1>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <Conversation agentId={agentId} />
      </div>
    </div>
  );
} 