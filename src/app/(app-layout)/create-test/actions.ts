export async function createTestApi(
  token: string,
  data: {
    title: string;
    tags: string[];
    questions: {
      text: string;
      type: "single" | "multiple" | "text";
      options: string[];
      correctAnswers: string[];
      points: number;
    }[];
  }
) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Add Authorization header if needed:
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Ошибка создания теста");
  }

  return response.json();
}
