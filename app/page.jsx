"use client";
import { SpeedInsights } from "@vercel/speed-insights/next"
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MonacoEditor = dynamic(() => import("react-monaco-editor"), { ssr: false });

// ------------------- ALL PISCINE QUESTIONS -------------------
const LOCAL_QUESTIONS = [
  {
    id: "checknumber",
    title: "CheckNumber",
    description: "Return true if a string contains any number.",
    difficulty: 1,
    template: `package piscine

func CheckNumber(arg string) bool {
    // Loop through string and check for digits
}`,
    validators: [
      { hint: "Loop through each character of the string." },
      { hint: "Check if character is between '0' and '9'." },
      { hint: "Return true if any digit is found, otherwise false." }
    ]
  },
  {
    id: "only1",
    title: "Only1",
    description: "Return true if the string contains exactly one '1'.",
    difficulty: 1,
    template: `package piscine

func Only1(s string) bool {
    // Count '1's in the string
}`,
    validators: [
      { hint: "Loop through string and count '1's." },
      { hint: "Return true if count is exactly 1, otherwise false." }
    ]
  },
  {
    id: "onlya",
    title: "OnlyA",
    description: "Return true if the string contains only 'a'.",
    difficulty: 1,
    template: `package piscine

func OnlyA(s string) bool {
    // Check if all characters are 'a'
}`,
    validators: [
      { hint: "Loop through string and check each character." },
      { hint: "Return false if any character is not 'a'." }
    ]
  },
  {
    id: "onlyb",
    title: "OnlyB",
    description: "Return true if the string contains only 'b'.",
    difficulty: 1,
    template: `package piscine

func OnlyB(s string) bool {
    // Check if all characters are 'b'
}`,
    validators: [
      { hint: "Loop through string and check each character." },
      { hint: "Return false if any character is not 'b'." }
    ]
  },
  {
    id: "onlyf",
    title: "OnlyF",
    description: "Return true if the string contains only 'f'.",
    difficulty: 1,
    template: `package piscine

func OnlyF(s string) bool {
    // Check if all characters are 'f'
}`,
    validators: [
      { hint: "Loop through string and check each character." },
      { hint: "Return false if any character is not 'f'." }
    ]
  },
  {
    id: "itoa",
    title: "Itoa",
    description: "Convert an integer to a string, handling negative numbers.",
    difficulty: 2,
    template: `package piscine

func Itoa(n int) string {
    // Convert integer to string without using strconv
}`,
    validators: [
      { hint: "Handle negative numbers first." },
      { hint: "Use division/modulo to extract digits." },
      { hint: "Convert digits to string and concatenate." },
      { hint: "Return the final string." }
    ]
  },
  {
    id: "repeatalpha",
    title: "RepeatAlpha",
    description: "Repeat each alphabetical character as many times as its alphabetical index.",
    difficulty: 2,
    template: `package piscine

func RepeatAlpha(s string) string {
    // Repeat letters according to their index in alphabet
}`,
    validators: [
      { hint: "Use rune values to get alphabetical index." },
      { hint: "Loop through each character." },
      { hint: "Repeat character index number of times." },
      { hint: "Concatenate to result string." }
    ]
  },
  {
    id: "fromto",
    title: "FromTo",
    description: "Return a formatted string showing the range from the first to the second integer.",
    difficulty: 2,
    template: `package piscine

func FromTo(a int, b int) string {
    // Return numbers from a to b with formatting
}`,
    validators: [
      { hint: "Use a loop from a to b." },
      { hint: "Prepend 0 if number < 10." },
      { hint: "Separate numbers with comma and space." },
      { hint: "Return final string with newline." }
    ]
  },
  {
    id: "fishandchips",
    title: "FishAndChips",
    description: "Return 'fish' if divisible by 2, 'chips' if divisible by 3, or both if divisible by 2 and 3.",
    difficulty: 2,
    template: `package piscine

func FishAndChips(n int) string {
    // Determine divisibility and return result
}`,
    validators: [
      { hint: "Check divisibility by 2 and 3." },
      { hint: "Return appropriate string." },
      { hint: "Return error if negative or non-divisible." }
    ]
  },
  {
    id: "findprevprime",
    title: "FindPrevPrime",
    description: "Return the first prime number less than or equal to the given integer.",
    difficulty: 3,
    template: `package piscine

func FindPrevPrime(nb int) int {
    // Find previous prime number
}`,
    validators: [
      { hint: "Loop down from nb to 2." },
      { hint: "Check if number is prime." },
      { hint: "Return the first prime found." },
      { hint: "Return 0 if none found." }
    ]
  },
  {
    id: "iscapitalized",
    title: "IsCapitalized",
    description: "Return true if every word starts with an uppercase letter or a non-alphabetic character.",
    difficulty: 3,
    template: `package piscine

func IsCapitalized(s string) bool {
    // Check each word for capitalization
}`,
    validators: [
      { hint: "Split string into words." },
      { hint: "Check first character of each word." },
      { hint: "Return false if any lowercase word found." },
      { hint: "Return true if all words pass." }
    ]
  }
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

  // Browser-only localStorage reads
  useEffect(() => {
    const savedScore = parseInt(localStorage.getItem("pp_score") || "0");
    const savedUser = localStorage.getItem("pp_user") || "Learner";
    setScore(savedScore);
    setUsername(savedUser);
  }, []);

  // Browser-only localStorage writes
  useEffect(() => {
    localStorage.setItem("pp_score", score);
  }, [score]);

  useEffect(() => {
    localStorage.setItem("pp_user", username);
  }, [username]);

  // Update code when question changes
  useEffect(() => {
    setCode(selectedQuestion.template);
  }, [questionIndex, selectedQuestion]);

  // Checker logic
  const runChecker = () => {
    if (!selectedQuestion) return;

    const text = code.toLowerCase();
    let feedback = [];
    let passed = text.includes("return"); // basic check

    if (!passed) feedback.push("Your code is missing a return statement.");

    if (passed) {
      setScore(score + 10);
      if (!completed.includes(selectedQuestion.id)) {
        setCompleted([...completed, selectedQuestion.id]);
      }
      alert(`✅ Passed! Score: ${score + 10}`);
      nextQuestion();
    } else {
      alert(`❌ Not Passed! Score: ${score}\nIssues:\n- ${feedback.join("\n- ")}`);
    }
  };

  const formatCode = () => {
    let formatted = code
      .split("\n")
      .map(line => line.trim())
      .map(line => (line.endsWith("{") ? line + "\n" : line))
      .join("\n");
    setCode(formatted);
  };

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
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col items-center">
      <Card className="shadow-xl p-6 rounded-xl w-full max-w-6xl bg-white">
        <h1 className="text-3xl font-bold mb-4 text-center text-indigo-700">Piscine Practice App</h1>

        <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
          <div className="bg-indigo-600 h-4 rounded-full" style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* LEFT PANEL */}
          <div className="md:w-1/3 p-4 border rounded-lg bg-indigo-50 flex flex-col gap-4">
            <div className="text-lg font-semibold text-indigo-900">
              Question {questionIndex + 1}: {selectedQuestion.title}
            </div>
            <div className="text-sm text-gray-800">{selectedQuestion.description}</div>
            <div className="mt-4">
              <strong>Hints:</strong>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {selectedQuestion.validators.map((v, i) => (
                  <li key={i}>{v.hint}</li>
                ))}
              </ul>
            </div>
            <div className="mt-2 text-xs italic text-gray-500">Source: {source}</div>
            <div className="mt-2 text-xs text-green-600">
              Completed: {completed.length}/{questions.length}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="md:w-2/3 flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <label className="text-sm font-medium">Name:</label>
              <input
                className="border p-2 rounded-lg flex-1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="ml-auto font-medium text-indigo-700">Score: {score}</div>
            </div>

            <div className="h-[380px] border rounded-lg overflow-hidden shadow-sm">
              <MonacoEditor
                width="100%"
                height="380"
                language="go"
                theme="vs-dark"
                value={code}
                onChange={(v) => setCode(v)}
                options={{ automaticLayout: true, minimap: { enabled: false }, fontSize: 14 }}
              />
            </div>

            <div className="flex flex-wrap gap-3 mt-2">
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
      <div className="text-center text-xs text-gray-500 mt-6">
        &copy; 2025 <a href="https://www.github.com/1magnova" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Jubril Aina</a>. All rights reserved.
      </div>
    </div>
  );
}