/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import {
  setFilter,
  setSearch,
  setPage,
  fetchTests,
} from "@/store/slices/testsSlice";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function TestsPage() {
  const dispatch = useDispatch();
  const { tests, filter, search, page, pageSize, loading, error } = useSelector(
    (state: RootState) => state.tests
  );

  const [searchTerm, setSearchTerm] = useState(search);
  const [tagFilter, setTagFilter] = useState(filter);

  useEffect(() => {
    dispatch(fetchTests() as any);
  }, [dispatch]);

  useEffect(() => {
    setSearchTerm(search);
  }, [search]);

  useEffect(() => {
    setTagFilter(filter);
  }, [filter]);

  const filteredTests = tests
    .filter((t) => (tagFilter ? t.tags.includes(tagFilter) : true))
    .filter((t) => t.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const pageCount = Math.ceil(filteredTests.length / pageSize);
  const pagedTests = filteredTests.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const uniqueTags = Array.from(new Set(tests.flatMap((t) => t.tags)));

  if (loading) return <p>Загрузка тестов...</p>;
  if (error) return <p className="text-danger">Ошибка: {error}</p>;

  return (
    <div>
      <h1>Список тестов</h1>

      <div className="mb-3 d-flex gap-2">
        <input
          type="text"
          placeholder="Поиск по названию"
          className="form-control"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") dispatch(setSearch(searchTerm));
          }}
        />
        <select
          className="form-select"
          value={tagFilter}
          onChange={(e) => {
            setTagFilter(e.target.value);
            dispatch(setFilter(e.target.value));
          }}
        >
          <option value="">Все теги</option>
          {uniqueTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <button
          className="btn btn-primary"
          onClick={() => dispatch(setSearch(searchTerm))}
        >
          Поиск
        </button>
      </div>

      <ul className="list-group mb-3">
        {pagedTests.length > 0 ? (
          pagedTests.map((test) => (
            <li
              key={test.id}
              className="list-group-item d-flex justify-content-between flex-column align-items-start"
            >
              <Link
                href={`/tests/${test.id}`}
                className="text-decoration-none mb-2 w-100"
              >
                <strong>{test.title}</strong> — Теги: {test.tags.join(", ")} —
                Вопросов: {test.questions.length}
              </Link>

              {test.testSubmissions && test.testSubmissions.length > 0 ? (
                <div className="text-success">
                  ✅ Ваш результат: {test.testSubmissions[0].earnedPoints}/
                  {test.testSubmissions[0].totalPoints} баллов —
                  <span className="text-muted ms-2">
                    {new Date(
                      test.testSubmissions[0].createdAt
                    ).toLocaleString()}
                  </span>
                </div>
              ) : (
                <div className="text-muted">Нет результатов</div>
              )}
            </li>
          ))
        ) : (
          <li className="list-group-item">Тесты не найдены.</li>
        )}
      </ul>

      {pageCount > 1 && (
        <nav>
          <ul className="pagination">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => dispatch(setPage(page - 1))}
                disabled={page === 1}
              >
                Назад
              </button>
            </li>
            {[...Array(pageCount)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${page === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => dispatch(setPage(i + 1))}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${page === pageCount ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => dispatch(setPage(page + 1))}
                disabled={page === pageCount}
              >
                Вперед
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
