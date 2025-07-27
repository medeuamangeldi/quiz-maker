"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function ProfilePage() {
  const identifier = useSelector((state: RootState) => state.auth.identifier);

  return (
    <div>
      <h1>Профиль пользователя</h1>
      <p>
        Имя пользователя / Email: <strong>{identifier ?? "Гость"}</strong>
      </p>
      <p>Рейтинг: 12345 (заглушка)</p>
      <p>Прогресс и достижения — будут добавлены позже</p>
    </div>
  );
}
