// actions.ts

export interface Question {
  id: string;
  text: string;
  type: "single" | "multiple" | "text";
  options?: string[];
  correctAnswers: string[];
  points: number;
}

export interface Test {
  id: number;
  title: string;
  tags: string[];
  questions: Question[];
}

export async function fetchTestById(testId: number): Promise<Test> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tests/${testId}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch test");
  }

  const test: Test = await response.json();
  return test;
}

export async function submitTest(
  token: string,
  testId: number,
  answers: Record<string, string[]>
): Promise<{
  totalPoints: number;
  earnedPoints: number;
  detailedResults: {
    questionId: string;
    correct: boolean;
    earnedPoints: number;
    totalPoints: number;
    message?: string;
  }[];
}> {
  const response = await await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tests/submit`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        testId,
        answers: Object.entries(answers).map(([questionId, answers]) => ({
          questionId,
          answers,
        })),
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Ошибка при отправке теста");
  }

  return response.json();
}
