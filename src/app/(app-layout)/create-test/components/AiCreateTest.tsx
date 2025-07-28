/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

type QuestionType = "single" | "multiple" | "text";

interface Question {
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswers: string[];
  points: number;
}

interface Test {
  title: string;
  tags: string[];
  questions: Question[];
}

interface AiCreateTestProps {
  onTestCreated: (test: Test) => void;
}

export default function AiCreateTest({ onTestCreated }: AiCreateTestProps) {
  const [topic, setTopic] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert("Введите тему теста");
      return;
    }
    if (numberOfQuestions <= 0) {
      alert("Количество вопросов должно быть больше 0");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token") || "";
      const generatedTest = await createTestWithAiApi(token, {
        topic,
        numberOfQuestions,
        specialInstructions,
      });
      onTestCreated(generatedTest);
    } catch (err: any) {
      setError(err.message || "Ошибка при генерации теста");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: 24,
        border: "1px solid #ccc",
        borderRadius: 8,
        marginBottom: 40,
        backgroundColor: "#fafafa",
      }}
    >
      <h2 style={{ marginBottom: 20, color: "#2c3e50" }}>
        Создать тест с помощью AI
      </h2>

      <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
        Тема теста
      </label>
      <input
        type="text"
        placeholder="Введите тему теста"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          fontSize: 16,
          borderRadius: 6,
          border: "1px solid #ccc",
          marginBottom: 20,
        }}
      />

      <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
        Количество вопросов
      </label>
      <input
        type="number"
        min={1}
        max={50}
        value={numberOfQuestions}
        onChange={(e) => setNumberOfQuestions(parseInt(e.target.value) || 1)}
        style={{
          width: 100,
          padding: 10,
          fontSize: 16,
          borderRadius: 6,
          border: "1px solid #ccc",
          marginBottom: 20,
        }}
      />

      <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
        Особые инструкции (необязательно)
      </label>
      <textarea
        placeholder="Например: Вопросы по алгебре и простым уравнениям"
        value={specialInstructions}
        onChange={(e) => setSpecialInstructions(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          fontSize: 16,
          borderRadius: 6,
          border: "1px solid #ccc",
          minHeight: 80,
          marginBottom: 24,
        }}
      />

      {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "12px 30px",
          border: "none",
          borderRadius: 6,
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: 16,
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Генерация..." : "Создать тест"}
      </button>
    </div>
  );
}

async function createTestWithAiApi(
  token: string,
  payload: {
    topic: string;
    numberOfQuestions: number;
    specialInstructions: string;
  }
): Promise<Test> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tests/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to generate test with AI");
  }

  return response.json();
}
