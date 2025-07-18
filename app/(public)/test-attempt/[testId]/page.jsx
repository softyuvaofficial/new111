"use client";

import { useEffect, useState, useRef } from "react";
import supabase from '@/lib/supabaseClient'
import { useRouter } from "next/navigation";

export default function TestAttemptPage({ params }) {
  const { testId } = params;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60 * 30); // 30 minutes default
  const timerRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch test details and questions
  useEffect(() => {
    async function fetchTest() {
      setLoading(true);
      try {
        // Fetch test meta (e.g. duration, title)
        const { data: test, error: testError } = await supabase
          .from("tests")
          .select("id, title, duration_minutes")
          .eq("id", testId)
          .single();

        if (testError) throw testError;

        // Fetch questions for this test
        const { data: qs, error: qError } = await supabase
          .from("questions")
          .select("id, question_text, options")
          .eq("test_id", testId)
          .order("id", { ascending: true });

        if (qError) throw qError;

        setTestData(test);
        setQuestions(qs);
        setTimeLeft((test.duration_minutes || 30) * 60);
      } catch (error) {
        console.error("Error loading test:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTest();
  }, [testId]);

  // Timer countdown
  useEffect(() => {
    if (loading) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [loading]);

  // Autosave answers to supabase every 15 seconds
  useEffect(() => {
    if (loading) return;
    const autosaveInterval = setInterval(() => {
      saveAnswersDraft();
    }, 15000);

    return () => clearInterval(autosaveInterval);
  }, [answers, loading]);

  async function saveAnswersDraft() {
    // Implement saving draft to supabase or localStorage
    console.log("Auto-saving answers...", answers);
    // For demo: just console log, real app would update DB
  }

  function handleAnswerSelect(questionId, selectedOption) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  }

  function handleNext() {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    }
  }

  function handlePrev() {
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
    }
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Submit answers to supabase
      // Example table: test_attempts with answers jsonb
      const { data, error } = await supabase.from("test_attempts").upsert({
        test_id: testId,
        user_id: supabase.auth.user()?.id,
        answers: answers,
        submitted_at: new Date().toISOString(),
      });

      if (error) throw error;

      alert("Test submitted successfully!");
      router.push(`/result/${testId}`);
    } catch (error) {
      alert("Failed to submit test: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading test...</p>
      </div>
    );
  }

  if (!testData || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Test or questions not found.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQIndex];
  const selectedAnswer = answers[currentQuestion.id] || "";

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">{testData.title}</h1>
        <div className="text-lg font-mono">
          Time Left:{" "}
          <span>
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Question panel */}
        <section className="flex-1 p-6 bg-white max-w-3xl">
          <h2 className="text-lg font-semibold mb-4">
            Question {currentQIndex + 1} / {questions.length}
          </h2>
          <p className="mb-6 text-gray-800">{currentQuestion.question_text}</p>

          <div className="space-y-4">
            {currentQuestion.options.map((option, i) => (
              <label
                key={i}
                className={`block p-3 border rounded cursor-pointer
                ${
                  selectedAnswer === option
                    ? "bg-indigo-100 border-indigo-500"
                    : "hover:bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={() => handleAnswerSelect(currentQuestion.id, option)}
                  className="mr-3"
                />
                {option}
              </label>
            ))}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentQIndex === 0}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentQIndex === questions.length - 1}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>

          <button
            onClick={() => {
              if (confirm("Are you sure you want to submit the test?")) {
                handleSubmit();
              }
            }}
            disabled={isSubmitting}
            className="mt-6 w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 disabled:opacity-50"
          >
            Submit Test
          </button>
        </section>

        {/* Question palette */}
        <aside className="bg-gray-200 p-4 w-full md:w-72 overflow-auto max-h-screen">
          <h3 className="font-semibold mb-3">Question Palette</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const isAnswered = !!answers[q.id];
              const isCurrent = idx === currentQIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQIndex(idx)}
                  className={`w-10 h-10 rounded-full text-sm font-semibold
                    ${
                      isCurrent
                        ? "bg-indigo-600 text-white"
                        : isAnswered
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-700"
                    }
                    hover:opacity-80 transition`}
                  title={`Question ${idx + 1} ${
                    isAnswered ? "(Answered)" : "(Not answered)"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </aside>
      </main>
    </div>
  );
}
