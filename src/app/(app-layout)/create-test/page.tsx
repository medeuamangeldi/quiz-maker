/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTestApi } from "./actions";
import AiCreateTest from "./components/AiCreateTest";

function cleanTest(test: any) {
  const { id, createdAt, updatedAt, ...cleanedTest } = test;

  cleanedTest.questions = cleanedTest.questions?.map((q: any) => {
    const { id, testId, ...cleanQ } = q;
    return cleanQ;
  });

  return cleanedTest;
}

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
  const router = useRouter();
  const [mode, setMode] = useState<"ai" | "manual">("ai");

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
      const cleanedTest = cleanTest(test);
      await createTestApi(token, cleanedTest);
      alert("Тест успешно добавлен!");
      router.push("/tests");
    } catch (err: any) {
      alert(err.message || "Ошибка при создании теста");
    }
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 24,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#333",
        backgroundColor: "#fefefe",
        boxShadow: "0 2px 8px rgb(0 0 0 / 0.1)",
        borderRadius: 8,
      }}
    >
      <h1 style={{ marginBottom: 24, textAlign: "center", color: "#2c3e50" }}>
        Создание теста
      </h1>

      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}
      >
        <button
          onClick={() => setMode("ai")}
          style={{
            padding: "10px 30px",
            cursor: "pointer",
            borderBottom:
              mode === "ai" ? "3px solid #007bff" : "3px solid transparent",
            backgroundColor: "transparent",
            fontWeight: mode === "ai" ? "700" : "400",
            fontSize: 16,
            marginRight: 10,
          }}
        >
          Создать с AI
        </button>
        <button
          onClick={() => setMode("manual")}
          style={{
            padding: "10px 30px",
            cursor: "pointer",
            borderBottom:
              mode === "manual" ? "3px solid #007bff" : "3px solid transparent",
            backgroundColor: "transparent",
            fontWeight: mode === "manual" ? "700" : "400",
            fontSize: 16,
          }}
        >
          Ручное создание
        </button>
      </div>

      {mode === "ai" ? (
        <AiCreateTest
          onTestCreated={(generatedTest: any) => {
            setTest(generatedTest);
            setMode("manual");
          }}
        />
      ) : (
        <>
          {/* Manual form */}
          {/* Test Title */}
          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor="testTitle"
              style={{ display: "block", marginBottom: 6, fontWeight: 600 }}
            >
              Название теста
            </label>
            <input
              id="testTitle"
              type="text"
              placeholder="Введите название теста"
              value={test.title}
              onChange={(e) => setTest({ ...test, title: e.target.value })}
              style={{
                width: "100%",
                padding: 10,
                fontSize: 16,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label
              htmlFor="testTags"
              style={{ display: "block", marginBottom: 6, fontWeight: 600 }}
            >
              Теги (через запятую)
            </label>
            <input
              id="testTags"
              type="text"
              placeholder="Например: математика, физика"
              value={test.tags.join(", ")}
              onChange={(e) =>
                setTest({
                  ...test,
                  tags: e.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag.length > 0),
                })
              }
              style={{
                width: "100%",
                padding: 10,
                fontSize: 16,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <button
              onClick={addQuestion}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "12px 30px",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              Добавить вопрос
            </button>
          </div>

          {/* Questions */}
          {test.questions.map((q, qIdx) => (
            <div
              key={qIdx}
              style={{
                backgroundColor: "#f9f9f9",
                borderRadius: 8,
                padding: 20,
                marginBottom: 32,
                boxShadow: "inset 0 0 8px rgb(0 0 0 / 0.05)",
              }}
            >
              {/* Question Text */}
              <label
                htmlFor={`question-text-${qIdx}`}
                style={{ display: "block", fontWeight: 600, marginBottom: 6 }}
              >
                Вопрос {qIdx + 1}
              </label>
              <input
                id={`question-text-${qIdx}`}
                type="text"
                placeholder="Введите текст вопроса"
                value={q.text}
                onChange={(e) => updateQuestion(qIdx, { text: e.target.value })}
                style={{
                  width: "100%",
                  padding: 10,
                  fontSize: 16,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  marginBottom: 20,
                }}
              />

              <label
                htmlFor={`question-type-${qIdx}`}
                style={{ display: "block", fontWeight: 600, marginBottom: 6 }}
              >
                Тип вопроса
              </label>
              <select
                id={`question-type-${qIdx}`}
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
                  padding: 10,
                  fontSize: 16,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  marginBottom: 24,
                }}
              >
                <option value="single">Один ответ</option>
                <option value="multiple">Множественный выбор</option>
                <option value="text">Текстовый ответ</option>
              </select>

              {(q.type === "single" || q.type === "multiple") && (
                <>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      marginBottom: 12,
                    }}
                  >
                    Варианты ответов
                  </label>
                  {q.options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 12,
                      }}
                    >
                      <input
                        type="text"
                        placeholder={`Вариант ${optIdx + 1}`}
                        value={opt}
                        onChange={(e) =>
                          updateOption(qIdx, optIdx, e.target.value)
                        }
                        style={{
                          flexGrow: 1,
                          padding: 8,
                          fontSize: 16,
                          borderRadius: 6,
                          border: "1px solid #ccc",
                        }}
                      />
                      <input
                        type={q.type === "single" ? "radio" : "checkbox"}
                        name={`correct-${qIdx}`}
                        checked={q.correctAnswers.includes(opt)}
                        onChange={(e) =>
                          toggleCorrectAnswer(qIdx, opt, e.target.checked)
                        }
                        style={{ cursor: "pointer", width: 20, height: 20 }}
                      />
                    </div>
                  ))}

                  <button
                    onClick={() => addOption(qIdx)}
                    style={{
                      padding: "6px 16px",
                      fontSize: 14,
                      cursor: "pointer",
                      borderRadius: 6,
                      border: "1px solid #007bff",
                      backgroundColor: "#e7f1ff",
                      color: "#007bff",
                    }}
                  >
                    Добавить вариант
                  </button>
                </>
              )}

              {/* Text question correct answer */}
              {q.type === "text" && (
                <>
                  <label
                    htmlFor={`correct-answer-${qIdx}`}
                    style={{
                      display: "block",
                      fontWeight: 600,
                      marginBottom: 6,
                      marginTop: 12,
                    }}
                  >
                    Правильный ответ
                  </label>
                  <input
                    id={`correct-answer-${qIdx}`}
                    type="text"
                    placeholder="Введите правильный ответ"
                    value={q.correctAnswers[0] || ""}
                    onChange={(e) =>
                      updateQuestion(qIdx, { correctAnswers: [e.target.value] })
                    }
                    style={{
                      width: "100%",
                      padding: 10,
                      fontSize: 16,
                      borderRadius: 6,
                      border: "1px solid #ccc",
                      marginBottom: 16,
                    }}
                  />
                </>
              )}

              {/* Points */}
              <label
                htmlFor={`points-${qIdx}`}
                style={{ display: "block", fontWeight: 600, marginBottom: 6 }}
              >
                Баллы за вопрос
              </label>
              <input
                id={`points-${qIdx}`}
                type="number"
                placeholder="Введите количество баллов"
                value={q.points}
                onChange={(e) =>
                  updateQuestion(qIdx, {
                    points: parseInt(e.target.value) || 0,
                  })
                }
                style={{
                  width: 100,
                  padding: 10,
                  fontSize: 16,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                }}
                min={0}
              />
            </div>
          ))}

          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleSubmit}
              style={{
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                padding: "14px 28px",
                fontSize: 18,
                borderRadius: 8,
                cursor: "pointer",
                boxShadow: "0 3px 8px rgb(40 167 69 / 0.5)",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLButtonElement).style.backgroundColor =
                  "#218838")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLButtonElement).style.backgroundColor =
                  "#28a745")
              }
            >
              Сохранить тест
            </button>
          </div>
        </>
      )}
    </div>
  );
}
