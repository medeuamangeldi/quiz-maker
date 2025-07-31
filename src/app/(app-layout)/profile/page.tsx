"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { getPointsLabel } from "@/helpers/getPointsLabel";

type TestSubmission = {
  id: number;
  testId: number;
  earnedPoints: number;
  totalPoints: number;
  createdAt: string;
};

type UserRanking = {
  rank: number;
  totalUsers: number;
  totalEarned: number;
  totalPossible: number;
  averageScore: number;
};

type UserData = {
  id: number;
  username: string;
  email: string;
  testSubmissions: TestSubmission[];
};

export default function ProfilePage() {
  const identifier = useSelector((state: RootState) => state.auth.identifier);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState<UserRanking | null>(null);
  const route = useRouter();

  const handleGoToTestById = (testId: number) => {
    route.push(`/tests/${testId}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchMe = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          console.warn("Unauthorized: redirecting to login...");
          localStorage.removeItem("token");
          route.push("/login");
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch user info");

        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRanking = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/my-ranking`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 401) {
          console.warn("Unauthorized: redirecting to login...");
          localStorage.removeItem("token");
          route.push("/login");
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch user ranking");

        const data = await res.json();
        setRanking(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMe().then(fetchRanking);
  }, [route]);

  return (
    <div>
      <h1>Профиль пользователя</h1>

      <p>
        Имя пользователя / Email:{" "}
        <strong>
          {userData
            ? `${userData?.username} / ${userData?.email}`
            : identifier ?? "Гость"}
        </strong>
      </p>

      <p>
        Рейтинг:{" "}
        {ranking ? (
          <>
            #{ranking.rank} из {ranking.totalUsers} • {ranking.totalEarned}{" "}
            баллов • средний {ranking.averageScore}%
          </>
        ) : (
          "Загрузка рейтинга..."
        )}
      </p>

      <hr />

      <h2>Мои результаты</h2>

      {loading ? (
        <p>Загрузка...</p>
      ) : userData?.testSubmissions?.length ? (
        <div className="space-y-4">
          {userData?.testSubmissions.map((submission) => {
            const percentage =
              (submission.earnedPoints / submission.totalPoints) * 100;

            let scoreColor = "text-red-600";
            if (percentage >= 80) scoreColor = "text-green-600";
            else if (percentage >= 50) scoreColor = "text-yellow-600";

            return (
              <div
                key={submission.id}
                onClick={() => handleGoToTestById(submission.testId)}
                style={{
                  cursor: "pointer",
                  border: "1px solid #ccc",
                  marginBottom: 12,
                  padding: 12,
                  transition: "background-color 0.2s",
                  borderRadius: 6,
                }}
                className="cursor-pointer border-b border-gray-200 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Тест #{submission.testId}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(submission.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className={`text-sm font-semibold ${scoreColor}`}>
                    {submission.earnedPoints}/{submission.totalPoints}{" "}
                    {getPointsLabel(submission.earnedPoints)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-muted">Нет пройденных тестов</p>
      )}
    </div>
  );
}
