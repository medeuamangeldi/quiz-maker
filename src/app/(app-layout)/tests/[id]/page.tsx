/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchTestById, submitTest, Test } from "./actions";

export default function TestDetailPage() {
  const { id } = useParams();
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({});
  const [result, setResult]: any = useState();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setUserAnswers({});

    fetchTestById(Number(id))
      .then((data) => {
        setTest(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Загрузка теста...</p>;
  if (error) return <p>Ошибка: {error}</p>;
  if (!test) return <p>Тест не найден</p>;

  const handleOptionChange = (
    questionId: string,
    option: string,
    type: "single" | "multiple"
  ) => {
    setUserAnswers((prev) => {
      const prevAnswers = prev[questionId] || [];

      if (type === "single") {
        return { ...prev, [questionId]: [option] };
      } else {
        if (prevAnswers.includes(option)) {
          return {
            ...prev,
            [questionId]: prevAnswers.filter((ans) => ans !== option),
          };
        } else {
          return {
            ...prev,
            [questionId]: [...prevAnswers, option],
          };
        }
      }
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    setResult(null);

    try {
      const token = localStorage.getItem("token") || "";
      const data = await submitTest(token, Number(id), userAnswers);
      setResult(data);
    } catch (e: any) {
      setSubmitError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>{test.title}</h1>
      <p>Теги: {test.tags.join(", ")}</p>

      <ul className="list-group mt-3">
        {test.questions.map((q, idx) => (
          <li key={q.id} className="list-group-item">
            <strong>
              {idx + 1}. {q.text} ({q.points} балл{q.points === 1 ? "" : "ов"})
            </strong>

            {(q.type === "single" || q.type === "multiple") && q.options && (
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {q.options.map((opt, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>
                    <label style={{ cursor: "pointer" }}>
                      <input
                        type={q.type === "single" ? "radio" : "checkbox"}
                        name={`question-${q.id}`}
                        value={opt}
                        checked={userAnswers[q.id]?.includes(opt) || false}
                        onChange={() =>
                          handleOptionChange(
                            q.id,
                            opt,
                            q.type as "single" | "multiple"
                          )
                        }
                        style={{ marginRight: 8 }}
                      />
                      {opt}
                    </label>
                  </li>
                ))}
              </ul>
            )}

            {q.type === "text" && (
              <input
                type="text"
                placeholder="Введите ответ"
                value={userAnswers[q.id]?.[0] || ""}
                onChange={(e) =>
                  setUserAnswers((prev) => ({
                    ...prev,
                    [q.id]: [e.target.value],
                  }))
                }
                style={{ marginTop: 8, width: "100%", padding: 6 }}
              />
            )}
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        {submitting ? "Отправка..." : "Отправить тест"}
      </button>

      {submitError && <p style={{ color: "red" }}>Ошибка: {submitError}</p>}

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>Результаты</h2>
          <p>
            Набранные баллы: {result.earnedPoints} / {result.totalPoints}
          </p>
          <ul>
            {result.detailedResults.map((res: any) => {
              const question = test.questions.find(
                (q) => q.id === res.questionId
              );
              return (
                <li key={res.questionId} style={{ marginBottom: 8 }}>
                  <strong>{question?.text}</strong> —{" "}
                  {res.correct ? (
                    <span style={{ color: "green" }}>
                      Верно (+{res.earnedPoints} из {res.totalPoints})
                    </span>
                  ) : (
                    <span style={{ color: "red" }}>Неверно</span>
                  )}
                  {res.message && <div>Комментарий: {res.message}</div>}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
