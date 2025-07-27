"use client";

import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <nav
      style={{
        width: 250,
        backgroundColor: "#f8f9fa",
        borderRight: "1px solid #ddd",
        height: "100vh",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h2
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/dashboard")}
        >
          QuizMaker
        </h2>

        <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
          <li>
            <button onClick={() => router.push("/dashboard")} style={linkStyle}>
              Главная
            </button>
          </li>
          <li style={{ marginTop: 12 }}>
            <button onClick={() => router.push("/tests")} style={linkStyle}>
              Тесты
            </button>
          </li>
          <li style={{ marginTop: 12 }}>
            <button
              onClick={() => router.push("/create-test")}
              style={linkStyle}
            >
              Создать тест
            </button>
          </li>
          <li style={{ marginTop: 12 }}>
            <button onClick={() => router.push("/profile")} style={linkStyle}>
              Профиль
            </button>
          </li>
        </ul>
      </div>

      <button
        onClick={handleLogout}
        style={{
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: 4,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Выйти
      </button>
    </nav>
  );
}

const linkStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#171717",
  textAlign: "left",
  padding: 0,
  fontSize: "1rem",
  cursor: "pointer",
};
