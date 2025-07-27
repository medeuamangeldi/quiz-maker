import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

export type QuestionType = "single" | "multiple" | "text";

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswers: string[]; // option strings or text answers
  points: number;
}

export interface Test {
  id: string;
  title: string;
  tags: string[];
  questions: Question[];
}

interface TestsState {
  tests: Test[];
  filter: string;
  search: string;
  page: number;
  pageSize: number;
  loading: boolean;
  error?: string;
}

export const fetchTests = createAsyncThunk<Test[]>(
  "tests/fetchTests",
  async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tests`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch tests");
    }
    return response.json();
  }
);

const initialState: TestsState = {
  tests: [],
  filter: "",
  search: "",
  page: 1,
  pageSize: 5,
  loading: false,
  error: undefined,
};

const testsSlice = createSlice({
  name: "tests",
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
      state.page = 1;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    addTest(state, action: PayloadAction<Omit<Test, "id">>) {
      const newTest: Test = {
        id: uuid(),
        ...action.payload,
      };
      state.tests.push(newTest);
    },
    updateTest(state, action: PayloadAction<Test>) {
      const index = state.tests.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tests[index] = action.payload;
      }
    },
    deleteTest(state, action: PayloadAction<string>) {
      state.tests = state.tests.filter((t) => t.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTests.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchTests.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload;
      })
      .addCase(fetchTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setFilter,
  setSearch,
  setPage,
  addTest,
  updateTest,
  deleteTest,
} = testsSlice.actions;

export default testsSlice.reducer;
