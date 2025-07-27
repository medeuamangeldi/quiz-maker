/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { createTestApi } from "./actions";

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

export default function CreateTestPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [test, setTest] = useState<Test>({
    title: "",
    tags: [],
    questions: [],
  });

  const addQuestion = () => {
    setTest((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          text: "",
          type: "single",
          options: [],
          correctAnswers: [],
          points: 0,
        },
      ],
    }));
  };

  const updateQuestion = (index: number, updated: Partial<Question>) => {
    const updatedQuestions = [...test.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], ...updated };
    setTest({ ...test, questions: updatedQuestions });
  };

  const addOption = (qIdx: number) => {
    const questions = [...test.questions];
    questions[qIdx].options.push("");
    setTest({ ...test, questions });
  };

  const updateOption = (qIdx: number, optIdx: number, value: string) => {
    const questions = [...test.questions];
    questions[qIdx].options[optIdx] = value;
    setTest({ ...test, questions });
  };

  const toggleCorrectAnswer = (
    qIdx: number,
    value: string,
    checked: boolean
  ) => {
    const question = test.questions[qIdx];
    let updated: string[];

    if (question.type === "single") {
      updated = checked ? [value] : [];
    } else {
      if (checked) {
        updated = [...question.correctAnswers, value];
      } else {
        updated = question.correctAnswers.filter((a) => a !== value);
      }
    }

    updateQuestion(qIdx, { correctAnswers: updated });
  };

  const handleSubmit = async () => {
    if (!test.title.trim()) {
      alert("Введите название теста");
      return;
    }
    if (test.questions.length === 0) {
      alert("Добавьте хотя бы один вопрос");
      return;
    }
    for (const q of test.questions) {
      if (!q.text.trim()) {
        alert("Все вопросы должны иметь текст");
        return;
      }
      if (q.points <= 0) {
        alert("Баллы за вопрос должны быть больше 0");
        return;
      }
      if (
        (q.type === "single" || q.type === "multiple") &&
        q.options.length === 0
      ) {
        alert("Вопросы с выбором должны иметь варианты ответа");
        return;
      }
      if (q.correctAnswers.length === 0) {
        alert("Укажите правильные ответы для всех вопросов");
        return;
      }
    }

    try {
      const token = localStorage.getItem("token") || "";
      await createTestApi(token, test);
      alert("Тест успешно добавлен!");
      router.push("/tests");
    } catch (err: any) {
      alert(err.message || "Ошибка при создании теста");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h1>Создание теста</h1>

      <div style={{ marginBottom: 16 }}>
        <input
          style={{ width: "100%", padding: 8, fontSize: 16 }}
          placeholder="Название теста"
          value={test.title}
          onChange={(e) => setTest({ ...test, title: e.target.value })}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <input
          style={{ width: "100%", padding: 8, fontSize: 16 }}
          placeholder="Теги (через запятую)"
          value={test.tags.join(", ")}
          onChange={(e) =>
            setTest({
              ...test,
              tags: e.target.value.split(",").map((tag) => tag.trim()),
            })
          }
        />
      </div>

      <button
        onClick={addQuestion}
        style={{
          marginBottom: 20,
          padding: "10px 15px",
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        Добавить вопрос
      </button>

      {test.questions.map((q, qIdx) => (
        <div
          key={qIdx}
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <input
            type="text"
            placeholder="Текст вопроса"
            value={q.text}
            onChange={(e) => updateQuestion(qIdx, { text: e.target.value })}
            style={{
              width: "100%",
              padding: 8,
              marginBottom: 12,
              fontSize: 16,
            }}
          />

          <select
            value={q.type}
            onChange={(e) =>
              updateQuestion(qIdx, {
                type: e.target.value as QuestionType,
                options: [],
                correctAnswers: [],
              })
            }
            style={{
              width: "100%",
              padding: 8,
              marginBottom: 12,
              fontSize: 16,
            }}
          >
            <option value="single">Один ответ</option>
            <option value="multiple">Множественный выбор</option>
            <option value="text">Текстовый ответ</option>
          </select>

          {(q.type === "single" || q.type === "multiple") && (
            <>
              {q.options.map((opt, optIdx) => (
                <div
                  key={optIdx}
                  style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 8,
                    alignItems: "center",
                  }}
                >
                  <input
                    type="text"
                    placeholder={`Вариант ${optIdx + 1}`}
                    value={opt}
                    onChange={(e) => updateOption(qIdx, optIdx, e.target.value)}
                    style={{ flexGrow: 1, padding: 8, fontSize: 16 }}
                  />
                  <input
                    type={q.type === "single" ? "radio" : "checkbox"}
                    name={`correct-${qIdx}`}
                    checked={q.correctAnswers.includes(opt)}
                    onChange={(e) =>
                      toggleCorrectAnswer(qIdx, opt, e.target.checked)
                    }
                  />
                </div>
              ))}
              <button
                onClick={() => addOption(qIdx)}
                style={{
                  marginTop: 8,
                  padding: "6px 12px",
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Добавить вариант
              </button>
            </>
          )}

          {q.type === "text" && (
            <input
              type="text"
              placeholder="Правильный ответ"
              value={q.correctAnswers[0] || ""}
              onChange={(e) =>
                updateQuestion(qIdx, { correctAnswers: [e.target.value] })
              }
              style={{ width: "100%", padding: 8, marginTop: 8, fontSize: 16 }}
            />
          )}

          <input
            type="number"
            placeholder="Баллы за вопрос"
            value={q.points}
            onChange={(e) =>
              updateQuestion(qIdx, { points: parseInt(e.target.value) || 0 })
            }
            style={{ width: "100%", padding: 8, marginTop: 12, fontSize: 16 }}
            min={0}
          />
        </div>
      ))}

      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          padding: "12px 20px",
          fontSize: 18,
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Сохранить тест
      </button>
    </div>
  );
}
