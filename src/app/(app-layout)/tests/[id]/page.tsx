/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchTestById, submitTest, Test } from "./actions";
import { fetchTopPerformers } from "./actions";
export default function TestDetailPage() {
  const { id } = useParams();
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({});
  const [result, setResult]: any = useState();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);

  const loadTestData = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setUserAnswers({});
    setTopPerformers([]);

    const token = localStorage.getItem("token") || "";

    try {
      const data = await fetchTestById(token, Number(id));
      setTest(data);

      const submission = data.testSubmissions?.[0];
      if (submission) {
        setResult({
          earnedPoints: submission.earnedPoints,
          totalPoints: submission.totalPoints,
          answers: submission.answers,
        });

        const answered: Record<string, string[]> = {};
        submission.answers.forEach((a: any) => {
          answered[a.questionId] = a.answers;
        });
        setUserAnswers(answered);
      }

      const performers = await fetchTopPerformers(token, Number(id));
      setTopPerformers(performers);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestData();
  }, [id]);

  const handleOptionChange = (
    questionId: string,
    option: string,
    type: "single" | "multiple"
  ) => {
    if (result) return;

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
      await submitTest(token, Number(id), userAnswers);

      await loadTestData();
    } catch (e: any) {
      setSubmitError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Загрузка теста...</p>;
  if (error) return <p>Ошибка: {error}</p>;
  if (!test) return <p>Тест не найден</p>;

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
                        disabled={!!result}
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
                  !result &&
                  setUserAnswers((prev) => ({
                    ...prev,
                    [q.id]: [e.target.value],
                  }))
                }
                disabled={!!result}
                style={{ marginTop: 8, width: "100%", padding: 6 }}
              />
            )}
          </li>
        ))}
      </ul>

      {!result && (
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
      )}

      {submitError && <p style={{ color: "red" }}>Ошибка: {submitError}</p>}

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>Результаты</h2>
          <p>
            Набранные баллы: {result.earnedPoints} / {result.totalPoints}
          </p>

          <ul>
            {test.questions.map((q) => {
              const answerEntry = result.answers?.find(
                (a: any) => Number(a.questionId) === (q.id as any)
              );
              const correctAnswers = q.correctAnswers;

              const isCorrect =
                JSON.stringify(answerEntry?.answers.sort()) ===
                JSON.stringify(correctAnswers.sort());

              return (
                <li key={q.id} style={{ marginBottom: 8 }}>
                  <strong>{q.text}</strong> —{" "}
                  {isCorrect ? (
                    <span style={{ color: "green" }}>Верно</span>
                  ) : (
                    <span style={{ color: "red" }}>Неверно</span>
                  )}
                  <div>Ваш ответ: {answerEntry?.answers.join(", ")}</div>
                  <div>Правильный ответ: {correctAnswers.join(", ")}</div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Top performers list */}
      <div style={{ marginTop: 40 }}>
        <h2>Лучшие результаты по тесту</h2>
        {topPerformers.length === 0 ? (
          <p>Нет результатов для отображения</p>
        ) : (
          <ol>
            {topPerformers.map((p) => (
              <li key={p.userId} style={{ marginBottom: 8 }}>
                <strong>{p.username}</strong> — {p.earnedPoints} /{" "}
                {p.totalPoints} баллов
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
