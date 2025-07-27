"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/authSlice";
import { login as loginApi } from "@/app/login/actions";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim() || !password.trim()) {
      alert("Введите имя пользователя/почту и пароль");
      return;
    }

    try {
      setLoading(true);

      const response = await loginApi(identifier, password);
      const token = response?.access_token;

      if (!token) throw new Error("Ошибка входа");

      localStorage.setItem("token", token);
      dispatch(login({ identifier, token }));
      router.push("/dashboard");
    } catch (error) {
      alert("Неверные данные. Попробуйте снова.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    router.push("/register");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <form
        onSubmit={handleSubmit}
        className="border p-4 rounded"
        style={{ minWidth: 320 }}
      >
        <h2 className="mb-4 text-center">Вход</h2>
        <input
          type="text"
          placeholder="Имя пользователя или Email"
          className="form-control mb-3"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          autoFocus
        />
        <input
          type="password"
          placeholder="Пароль"
          className="form-control mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary w-100 mb-3"
          disabled={loading}
        >
          {loading ? "Вход..." : "Войти"}
        </button>
        <div className="text-center">
          <span>Нет аккаунта? </span>
          <button
            type="button"
            onClick={handleRegisterRedirect}
            className="btn btn-link p-0"
            style={{ fontSize: "1rem" }}
          >
            Зарегистрируйтесь
          </button>
        </div>
      </form>
    </div>
  );
}
