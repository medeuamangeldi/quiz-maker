"use client";

import { getPointsLabel } from "@/helpers/getPointsLabel";
import { useRouter } from "next/navigation";
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
  const route = useRouter();

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

        if (res.status === 401) {
          console.warn("Unauthorized. Redirecting to login...");
          localStorage.removeItem("token");
          route.push("/login");
          return;
        }

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

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
    <div className="container mt-4">
      <h1 className="mb-4">Добро пожаловать в QuizMaker!</h1>

      <h2 className="mb-3">🏆 Топ пользователей</h2>
      {loading ? (
        <p>Загрузка рейтинга...</p>
      ) : rankings?.length > 0 ? (
        <ul className="list-group">
          {rankings?.slice(0, 10).map((user, index) => (
            <li
              key={user.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>#{index + 1}</strong> — {user.username}
              </div>
              <div>
                {user?.totalEarned} {getPointsLabel(user.totalEarned)} —{" "}
                {user?.averageScore}%
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
