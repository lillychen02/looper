"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const interviewTypes = [
  {
    key: "product-sense",
    title: "Product Sense",
    description: "Assess your ability to identify user needs, articulate problems, and craft compelling solutions while demonstrating empathy, creativity, and structured thinking",
    duration: "40 min",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><path d="M16 2v4M16 26v4M6.343 6.343l2.828 2.828M22.829 22.829l2.828 2.828M2 16h4M26 16h4M6.343 25.657l2.828-2.828M22.829 9.171l2.828-2.828" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/><circle cx="16" cy="16" r="7" stroke="#3B82F6" strokeWidth="2"/></svg>
    ),
    active: true,
    comingSoon: false,
    color: "blue",
    agentId: "Ykg1OlN7H58nquphXgmt",
  },
  {
    key: "critical-analytical",
    title: "Critical Thinking",
    description: "Assess your ability to think critically through a product problem, test your quantitative ability and test how you make decisions using data",
    duration: "40 min",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect x="6" y="6" width="20" height="20" rx="3" stroke="#A78BFA" strokeWidth="2"/><path d="M10 14h12M10 18h8" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    active: true,
    comingSoon: false,
    color: "purple",
    agentId: "0vdorfV4DR2C8SZXJsLQ",
  },
  {
    key: "leadership",
    title: "Leadership",
    description: "Demonstrate your leadership skills and ability to influence others",
    duration: "40 min",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="12" r="4" stroke="#22C55E" strokeWidth="2"/><path d="M8 26c0-4 4-6 8-6s8 2 8 6" stroke="#22C55E" strokeWidth="2"/></svg>
    ),
    active: false,
    comingSoon: true,
    color: "green",
  },
  {
    key: "behavioral",
    title: "Behavioral",
    description: "Demonstrate how you think, act, and solve problems in real-world situations based on your past experiences",
    duration: "35 min",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="10" cy="14" r="4" stroke="#F59E42" strokeWidth="2"/><circle cx="22" cy="14" r="4" stroke="#F59E42" strokeWidth="2"/><path d="M6 26c0-2.21 2.686-4 6-4s6 1.79 6 4M16 26c0-2.21 2.686-4 6-4s6 1.79 6 4" stroke="#F59E42" strokeWidth="2"/></svg>
    ),
    active: false,
    comingSoon: true,
    color: "orange",
  },
];

function Card({ type, onClick }: { type: typeof interviewTypes[0]; onClick: () => void }) {
  return (
    <div
      className={`flex flex-col flex-1 min-w-[300px] max-w-[400px] p-6 rounded-xl shadow-md border transition-all cursor-pointer bg-white ${
        type.active
          ? `border-${type.color}-400 hover:shadow-lg`
          : "border-gray-200 opacity-60 cursor-not-allowed"
      }`}
      onClick={type.active ? onClick : undefined}
      style={{ position: "relative" }}
    >
      <div className="flex items-center gap-2 mb-2">
        {type.icon}
        <span className={`text-lg font-semibold ${
          type.color === 'blue' ? 'text-blue-600' :
          type.color === 'purple' ? 'text-purple-600' :
          type.color === 'green' ? 'text-green-600' :
          'text-orange-600'
        }`}>{type.title}</span>
        {type.active && (
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-600">Available</span>
        )}
        {type.comingSoon && (
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500">Coming Soon</span>
        )}
      </div>
      <div className="text-gray-600 mb-4 text-sm">{type.description}</div>
      <div className="flex items-center justify-between mt-auto">
        <span className={`text-${type.color}-500 font-medium`}>{type.duration}</span>
        {type.active ? (
          <span className="text-xl text-gray-400">→</span>
        ) : (
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="#D1D5DB" strokeWidth="2"/><path d="M7 10h6" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/></svg>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [scores, setScores] = useState<number[] | null>(null);
  const [justifications, setJustifications] = useState<string[] | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="flex items-center justify-between px-8 py-4 border-b bg-white">
        <div className="flex items-center gap-2">
          <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="12" stroke="#2563EB" strokeWidth="2"/><path d="M14 8v6l4 2" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/></svg>
          <span className="font-bold text-lg text-gray-900">PM Interview Practice</span>
        </div>
      </header>
      <main className="flex flex-col items-center flex-1 px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 mt-4 text-center text-gray-900">Welcome to PM Interview Practice</h1>
        <p className="text-gray-600 mb-8 text-center max-w-xl">
          Practice with AI that simulates interviews at top-tier tech companies.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch w-full max-w-5xl mb-8">
          {interviewTypes.map((type) => (
            <Card
              key={type.key}
              type={type}
              onClick={() => {
                if (type.active) router.push(`/conversation?agentId=${type.agentId}`);
              }}
            />
          ))}
        </div>
        <div className="text-gray-400 text-sm text-center mt-4">
          Pro Tip: Speak clearly and concisely. Focus on structured answers using frameworks like STAR.
        </div>
      </main>
    </div>
  );
}
