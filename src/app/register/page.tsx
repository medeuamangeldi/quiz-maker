"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/register/actions";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !identifier || !password || !confirmPassword) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    if (password !== confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }

    try {
      setLoading(true);
      const result = await registerUser({
        username,
        email: identifier,
        password,
      });

      if (result?.id) {
        router.push("/login");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert((error.message as string) || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <form
        onSubmit={handleSubmit}
        className="border p-4 rounded"
        style={{ minWidth: 320 }}
      >
        <h2 className="mb-4 text-center">Регистрация</h2>

        <input
          type="text"
          placeholder="Имя пользователя"
          className="form-control mb-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
        />
        <input
          type="email"
          placeholder="Email"
          className="form-control mb-3"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          className="form-control mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Подтвердите пароль"
          className="form-control mb-3"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-success w-100 mb-3"
          disabled={loading}
        >
          {loading ? "Загрузка..." : "Зарегистрироваться"}
        </button>

        <div className="text-center">
          <span>Уже есть аккаунт? </span>
          <button
            type="button"
            onClick={handleGoToLogin}
            className="btn btn-link p-0"
            style={{ fontSize: "1rem" }}
          >
            Войти
          </button>
        </div>
      </form>
    </div>
  );
}
