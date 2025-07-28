"use client";

import { useEffect, useState } from "react";

type RankingUser = {
  id: number;
  username: string;
  totalEarned: number;
  averageScore: number;
};

export default function DashboardPage() {
  const [rankings, setRankings] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRankings() {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/rankings`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setRankings(data);
      } catch (error) {
        console.error("Ошибка загрузки рейтинга:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRankings();
  }, []);

  return (
    <div>
      <h1>Добро пожаловать в QuizMaker!</h1>

      <h2 className="mt-6 text-xl font-semibold">🏆 Топ пользователей</h2>
      {loading ? (
        <p>Загрузка рейтинга...</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {rankings.slice(0, 10).map((user, index) => (
            <li key={user.id} className="border p-2 rounded shadow">
              <strong>#{index + 1}</strong> — {user.username} —{" "}
              {user.totalEarned}
              {" балл" +
                (user.totalEarned === 0 || user.totalEarned >= 5
                  ? "ов"
                  : user.totalEarned != 1
                  ? "а"
                  : "")}{" "}
              — {user.averageScore}%
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
