"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MonacoEditor = dynamic(() => import("react-monaco-editor"), { ssr: false });

// ------------------- FULL QUESTION BANK -------------------
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

// ------------------- LANGUAGE DETECTION -------------------
// ------------------- LANGUAGE DETECTION -------------------
// ------------------- LANGUAGE DETECTION -------------------
const detectLanguage = (code) => {
  const trimmed = code.trim();
  console.log("Detecting language for:", trimmed.substring(0, 20) + "...");

  // HTML: Starts with < and has a tag-like structure, or contains common tags
  if (trimmed.match(/^<[a-z!]/i) || trimmed.includes("</div>") || trimmed.includes("</body>") || trimmed.includes("</p>") || trimmed.includes("</span>")) {
    console.log("Detected: html");
    return "html";
  }

  if (trimmed.includes("package main") || trimmed.includes("func main") || trimmed.includes("fmt.Print")) return "go";
  if (trimmed.includes("def ") || trimmed.includes("import ") || trimmed.includes("print(") || trimmed.includes("class ")) return "python";
  if (trimmed.includes("import React") || trimmed.includes("console.log") || trimmed.includes("const ") || trimmed.includes("let ") || trimmed.includes("function ") || trimmed.includes("=>")) return "javascript";
  if (trimmed.includes("#include <") || trimmed.includes("int main(") || trimmed.includes("std::")) return "cpp";
  if (trimmed.includes("public class") || trimmed.includes("System.out.println") || trimmed.includes("public static void main")) return "java";
  if (trimmed.includes("body {") || trimmed.includes("div {") || trimmed.includes("margin:") || trimmed.includes("color:")) return "css";

  console.log("Detected: go (fallback)");
  return "go"; // Default fallback
};

// ------------------- FORMATTER LOGIC -------------------
const formatCodeLogic = (code, language) => {
  // Simple indentation-based formatter for C-style languages
  if (!["go", "javascript", "java", "cpp", "css", "html"].includes(language)) {
    return code; // Return original if not supported
  }

  const lines = code.split("\n");
  let indentLevel = 0;
  const indentStr = "\t";

  return lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return "";

    // Decrease indent if line starts with closing bracket
    let currentIndent = indentLevel;
    if (trimmed.startsWith("}") || trimmed.startsWith(")") || trimmed.startsWith("]") || trimmed.startsWith("</")) {
      currentIndent = Math.max(0, currentIndent - 1);
    }

    const formatted = indentStr.repeat(currentIndent) + trimmed;

    // Calculate indent for the next line
    const openBraces = (trimmed.match(/\{/g) || []).length;
    const closeBraces = (trimmed.match(/\}/g) || []).length;
    const openParens = (trimmed.match(/\(/g) || []).length;
    const closeParens = (trimmed.match(/\)/g) || []).length;
    const openBrackets = (trimmed.match(/\[/g) || []).length;
    const closeBrackets = (trimmed.match(/\]/g) || []).length;

    // HTML-ish tag detection (very basic)
    const openTags = (trimmed.match(/<[a-zA-Z0-9]+[^>]*>/g) || []).filter(t => !t.includes("/>") && !t.startsWith("</")).length;
    const closeTags = (trimmed.match(/<\/[a-zA-Z0-9]+>/g) || []).length;

    const netChange = (openBraces - closeBraces) + (openParens - closeParens) + (openBrackets - closeBrackets) + (openTags - closeTags);
    indentLevel = Math.max(0, indentLevel + netChange);

    return formatted;
  }).join("\n");
};

// ------------------- PAGE COMPONENT -------------------
export default function Page() {
  const [questions, setQuestions] = useState([...LOCAL_QUESTIONS]);
  const [source, setSource] = useState("Local");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [code, setCode] = useState(questions[0].template);
  const [score, setScore] = useState(0);
  const [username, setUsername] = useState("Learner");
  const [completed, setCompleted] = useState([]);
  const [language, setLanguage] = useState("go");
  const [autoDetect, setAutoDetect] = useState(true);
  const [editorInstance, setEditorInstance] = useState(null);
  const [monacoInstance, setMonacoInstance] = useState(null);

  const selectedQuestion = questions[questionIndex];

  useEffect(() => {
    const savedScore = parseInt(localStorage.getItem("pp_score") || "0");
    const savedUser = localStorage.getItem("pp_user") || "Learner";
    setScore(savedScore);
    setUsername(savedUser);
  }, []);

  useEffect(() => localStorage.setItem("pp_score", score), [score]);
  useEffect(() => localStorage.setItem("pp_user", username), [username]);
  useEffect(() => {
    setCode(selectedQuestion.template);
    if (autoDetect) {
      setLanguage(detectLanguage(selectedQuestion.template));
    }
  }, [questionIndex, selectedQuestion]);

  useEffect(() => {
    if (autoDetect) {
      const detected = detectLanguage(code);
      if (detected !== language) setLanguage(detected);
    }
  }, [code, autoDetect, language]);

  useEffect(() => {
    if (editorInstance && monacoInstance) {
      const model = editorInstance.getModel();
      if (model) {
        monacoInstance.editor.setModelLanguage(model, language);
      }

      // Force update options to ensure auto-closing works for the new language
      editorInstance.updateOptions({
        autoClosingBrackets: "always",
        autoClosingQuotes: "always",
        autoClosingTags: true, // For HTML
        autoIndent: "full",
        formatOnType: true,
        formatOnPaste: true,
        matchBrackets: "always",
        autoSurround: "languageDefined",
        renderValidationDecorations: "on", // Show redlines
        suggest: {
          showWords: false, // Don't show generic words, only semantic suggestions
        }
      });
    }
  }, [language, editorInstance, monacoInstance]);

  const runChecker = () => {
    if (!selectedQuestion) return;

    const text = code.toLowerCase();
    let feedback = [];
    let passed = text.includes("return"); // basic check

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

  const handleFormatCode = () => {
    if (editorInstance) {
      editorInstance.getAction('editor.action.formatDocument').run();
    } else {
      // Fallback if editor instance not ready
      const formatted = formatCodeLogic(code, language);
      setCode(formatted);
    }
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

            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700">Language:</label>
              <select
                className="border p-1 rounded text-sm bg-white"
                value={autoDetect ? "auto" : language}
                onChange={(e) => {
                  if (e.target.value === "auto") {
                    setAutoDetect(true);
                  } else {
                    setAutoDetect(false);
                    setLanguage(e.target.value);
                  }
                }}
              >
                <option value="auto">Auto-detect</option>
                <option value="go">Go</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
              <span className="text-xs text-gray-500 ml-2">
                (Current: {language.toUpperCase()})
              </span>
            </div>

            <div className="h-[300px] sm:h-[350px] md:h-[400px] border rounded-lg overflow-hidden shadow-sm">
              <MonacoEditor
                width="100%"
                height="100%"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(v) => setCode(v)}
                editorDidMount={(editor, monaco) => {
                  setEditorInstance(editor);
                  setMonacoInstance(monaco);

                  // Register formatter for supported languages
                  const languages = ["go", "javascript", "java", "cpp", "css", "html"];
                  languages.forEach(lang => {
                    monaco.languages.registerDocumentFormattingEditProvider(lang, {
                      provideDocumentFormattingEdits: (model) => {
                        const text = model.getValue();
                        const formatted = formatCodeLogic(text, lang);
                        return [
                          {
                            range: model.getFullModelRange(),
                            text: formatted,
                          },
                        ];
                      },
                    });
                  });
                }}
                options={{
                  automaticLayout: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  autoClosingBrackets: "always",
                  autoClosingQuotes: "always",
                  autoIndent: "full",
                  formatOnType: true,
                  formatOnPaste: true,
                  tabSize: 4,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 justify-start sm:justify-start">
              <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={runChecker}>Run Checker</Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleFormatCode}>Format Code</Button>
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-white" onClick={resetQuestion}>Reset Question</Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={resetAll}>Reset All</Button>
              <Button className="bg-indigo-500 hover:bg-indigo-600 text-white" onClick={nextQuestion}>Next Question</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Footer */}
      <div className="text-center text-xs sm:text-sm text-gray-500 mt-6">
        &copy; 2025 <a href="https://www.github.com/1magnova" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Mag and the Piscine Clan</a>. All rights reserved.
      </div>
    </div>
  );
}