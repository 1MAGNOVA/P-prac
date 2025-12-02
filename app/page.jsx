"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MonacoEditor = dynamic(() => import("react-monaco-editor"), { ssr: false });

const LOCAL_QUESTIONS = [
  // ...All your questions from previous update...
];

// ------------------- PAGE COMPONENT -------------------
export default function Page() {
  const [questions, setQuestions] = useState([...LOCAL_QUESTIONS]);
  const [source, setSource] = useState("Local");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [code, setCode] = useState(questions[0].template);
  const [score, setScore] = useState(0);
  const [username, setUsername] = useState("Learner");
  const [completed, setCompleted] = useState([]);

  const selectedQuestion = questions[questionIndex];

  useEffect(() => {
    const savedScore = parseInt(localStorage.getItem("pp_score") || "0");
    const savedUser = localStorage.getItem("pp_user") || "Learner";
    setScore(savedScore);
    setUsername(savedUser);
  }, []);

  useEffect(() => localStorage.setItem("pp_score", score), [score]);
  useEffect(() => localStorage.setItem("pp_user", username), [username]);
  useEffect(() => setCode(selectedQuestion.template), [questionIndex, selectedQuestion]);

  const runChecker = () => {
    if (!selectedQuestion) return;

    const text = code.toLowerCase();
    let feedback = [];
    let passed = text.includes("return");

    if (!passed) feedback.push("Your code is missing a return statement.");

    if (passed) {
      setScore(score + 10);
      if (!completed.includes(selectedQuestion.id)) setCompleted([...completed, selectedQuestion.id]);
      alert(`✅ Passed! Score: ${score + 10}`);
      nextQuestion();
    } else {
      alert(`❌ Not Passed! Score: ${score}\nIssues:\n- ${feedback.join("\n- ")}`);
    }
  };

  const formatCode = () => setCode(code.split("\n").map(line => line.trim()).join("\n"));
  const nextQuestion = () => setQuestionIndex((i) => (i + 1) % questions.length);
  const resetQuestion = () => setCode(selectedQuestion.template);
  const resetAll = () => {
    setQuestions([...LOCAL_QUESTIONS]);
    setQuestionIndex(0);
    setCode(LOCAL_QUESTIONS[0].template);
    setScore(0);
    setCompleted([]);
    localStorage.setItem("pp_score", "0");
  };

  if (!selectedQuestion) return <div className="p-10">Loading questions...</div>;

  const progressPercent = Math.round(((questionIndex + 1) / questions.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-2 sm:px-6 md:px-8 py-6">
      <Card className="shadow-xl p-4 sm:p-6 md:p-8 rounded-xl w-full max-w-7xl bg-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-indigo-700">Piscine Practice App</h1>

        <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 mb-6">
          <div className="bg-indigo-600 h-3 sm:h-4 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* LEFT PANEL */}
          <div className="lg:w-1/3 p-3 sm:p-4 border rounded-lg bg-indigo-50 flex flex-col gap-3">
            <div className="text-md sm:text-lg font-semibold text-indigo-900">
              Question {questionIndex + 1}: {selectedQuestion.title}
            </div>
            <div className="text-sm sm:text-base text-gray-800">{selectedQuestion.description}</div>
            <div className="mt-2">
              <strong>Hints:</strong>
              <ul className="list-disc list-inside text-xs sm:text-sm text-gray-700">
                {selectedQuestion.validators.map((v, i) => <li key={i}>{v.hint}</li>)}
              </ul>
            </div>
            <div className="mt-2 text-xs italic text-gray-500">Source: {source}</div>
            <div className="mt-2 text-xs text-green-600">
              Completed: {completed.length}/{questions.length}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:w-2/3 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <label className="text-sm sm:text-base font-medium">Name:</label>
              <input
                className="border p-2 rounded-lg flex-1 min-w-[150px]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="ml-auto font-medium text-indigo-700">Score: {score}</div>
            </div>

            <div className="h-[300px] sm:h-[350px] md:h-[400px] border rounded-lg overflow-hidden shadow-sm">
              <MonacoEditor
                width="100%"
                height="100%"
                language="go"
                theme="vs-dark"
                value={code}
                onChange={(v) => setCode(v)}
                options={{ automaticLayout: true, minimap: { enabled: false }, fontSize: 14 }}
              />
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 justify-start sm:justify-start">
              <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={runChecker}>Run Checker</Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={formatCode}>Format Code</Button>
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-white" onClick={resetQuestion}>Reset Question</Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={resetAll}>Reset All</Button>
              <Button className="bg-indigo-500 hover:bg-indigo-600 text-white" onClick={nextQuestion}>Next Question</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Footer */}
      <div className="text-center text-xs sm:text-sm text-gray-500 mt-6">
        &copy; 2025 <a href="https://www.github.com/1magnova" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Mag</a>. All rights reserved.
      </div>
    </div>
  );
}