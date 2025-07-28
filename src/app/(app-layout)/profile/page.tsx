"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

type TestSubmission = {
  id: number;
  testId: number;
  earnedPoints: number;
  totalPoints: number;
  createdAt: string;
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

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch user info");
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  return (
    <div>
      <h1>Профиль пользователя</h1>

      <p>
        Имя пользователя / Email:{" "}
        <strong>
          {userData
            ? `${userData.username} / ${userData.email}`
            : identifier ?? "Гость"}
        </strong>
      </p>

      <p>Рейтинг: 12345 (заглушка)</p>
      <p>Прогресс и достижения — будут добавлены позже</p>

      <hr />

      <h2>Мои результаты</h2>

      {loading ? (
        <p>Загрузка...</p>
      ) : userData?.testSubmissions?.length ? (
        <ul className="list-unstyled">
          {userData.testSubmissions.map((submission) => (
            <li key={submission.id}>
              📝 Тест #{submission.testId}:{" "}
              <strong>
                {submission.earnedPoints}/{submission.totalPoints} баллов
              </strong>{" "}
              —{" "}
              <span className="text-muted">
                {new Date(submission.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">Нет пройденных тестов</p>
      )}
    </div>
  );
}
