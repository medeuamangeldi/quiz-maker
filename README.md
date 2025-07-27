Got it! Here's a concise and clear README.md tailored for your **frontend** project, referencing your GitHub repo and focusing on usage, setup, and architecture:

---

# QuizMaker Frontend

Frontend application for **QuizMaker** — a platform to create and take interactive quizzes with various question types.

## Repository

```
git@github.com:medeuamangeldi/quiz-maker.git
```

---

## Project Description

This frontend is built with **Next.js** and TypeScript. It provides user interfaces for:

- Viewing a list of quizzes with search, filtering by tags, and pagination.
- Taking quizzes with support for single-choice, multiple-choice, and text-answer questions.
- Submitting answers to the backend and displaying detailed results.
- Basic user interaction with loading and error handling.

---

## Installation and Setup

1. Clone the repository:

```bash
git clone git@github.com:medeuamangeldi/quiz-maker.git
cd quiz-maker/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` file in the frontend root with:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Replace URL with your backend API endpoint.

4. Run the development server:

```bash
npm run dev
```

5. Open your browser at `http://localhost:3001` (or the default Next.js port).

---

## Features

- **Quiz List**: Search quizzes by title, filter by tags, with pagination.
- **Quiz Detail**: Display questions of different types and options.
- **Answer Submission**: Submit user answers securely to backend API.
- **Result Feedback**: Show earned points and detailed per-question feedback.
- **Loading and Error States**: Handle API loading and errors gracefully.

---

Sure! Here's the updated **Architectural Notes** section with Redux, thunk, and slices included:

---

## Architectural Notes

- **Next.js** framework for React-based SSR and routing.
- React Hooks (`useState`, `useEffect`) manage component state and side effects.
- **Redux Toolkit** is used for global state management, organizing state into **slices**.
- **Redux Thunk** middleware handles asynchronous actions like API calls.
- Data fetching is done via API calls defined in the `actions.ts` module, dispatched through Redux async thunks.
- User answers and other UI state are managed locally in components, while tests, filters, pagination, and search states are managed globally in Redux slices.
- Authentication token (JWT) is stored in `localStorage` and sent in request headers.
- The frontend does not directly call any external APIs; all calls are proxied through your backend API.

---

## How to Contribute

- Fork the repo, create a branch, and open a Pull Request.
- Follow the existing code style and commit message conventions.
- Please test your changes locally before submitting.

---

## Contact

For questions or suggestions, open an issue or contact Medeu Amangeldi. telegram: @medeuedem

---
