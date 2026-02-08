import React, { useEffect, useState } from "react";
import "./App.css";

const quotes = [
  "Small progress is still progress 🌱",
  "Consistency beats motivation 🔥",
  "One task closer to your goal 🚀",
  "Focus. Finish. Repeat. ✨",
  "Do it for your future self 💡",
];

const App = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [quote, setQuote] = useState(quotes[0]);
  const [dark, setDark] = useState(false);

  /* calendar state */
  const [currentDate, setCurrentDate] = useState(new Date());

  /* edit state */
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  /* ---------- Random Quote ---------- */
  useEffect(() => {
    const i = setInterval(() => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 4000);
    return () => clearInterval(i);
  }, []);

  /* ---------- Local Storage ---------- */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("todos"));
    if (saved) setTodos(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  /* ---------- Todo Logic ---------- */
  const addTodo = () => {
    if (!todo.trim()) return;
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: todo,
        completed: false,
        date: new Date().toISOString().split("T")[0],
      },
    ]);
    setTodo("");
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const saveEdit = (id) => {
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, text: editText } : t
      )
    );
    setEditId(null);
  };

  /* ---------- Filters ---------- */
  const filteredTodos = todos.filter((t) =>
    filter === "all"
      ? true
      : filter === "active"
      ? !t.completed
      : t.completed
  );

  /* ---------- Analytics ---------- */
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  /* ---------- Calendar Logic ---------- */
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const prevMonth = () =>
    setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () =>
    setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className={`app ${dark ? "dark" : ""}`}>
      <button className="theme-toggle" onClick={() => setDark(!dark)}>
        {dark ? "☀️" : "🌙"}
      </button>

      <div className="card">
        <h1>Todo Planner</h1>
        <p className="quote">{quote}</p>

        {/* TOP */}
        <div className="top-section">
          {/* CALENDAR */}
          <div className="calendar">
            <div className="calendar-header">
              <button onClick={prevMonth}>‹</button>
              <h3>
                {currentDate.toLocaleString("default", { month: "long" })}{" "}
                {year}
              </h3>
              <button onClick={nextMonth}>›</button>
            </div>

            <div className="calendar-grid">
              {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                <span key={d} className="day-name">{d}</span>
              ))}

              {[...Array(firstDay)].map((_, i) => (
                <span key={i} />
              ))}

              {[...Array(daysInMonth)].map((_, i) => {
                const isToday =
                  i + 1 === today.getDate() &&
                  month === today.getMonth() &&
                  year === today.getFullYear();

                return (
                  <span key={i} className={`date ${isToday ? "today" : ""}`}>
                    {i + 1}
                  </span>
                );
              })}
            </div>
          </div>

          {/* ANALYTICS */}
          <div className="analytics-circle">
            <svg>
              <circle cx="60" cy="60" r="50" />
              <circle
                cx="60"
                cy="60"
                r="50"
                style={{
                  strokeDasharray: 314,
                  strokeDashoffset: 314 - (314 * percent) / 100,
                }}
              />
            </svg>
            <div className="percent">{percent}%</div>
            <small>Completed</small>
          </div>
        </div>

        {/* ADD */}
        <div className="input-container">
          <input
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            placeholder="Add a new task..."
          />
          <button onClick={addTodo}>Add</button>
        </div>

        {/* FILTERS */}
        <div className="filters">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* TODOS */}
        <ul>
          {filteredTodos.map((t) => (
            <li key={t.id} className={t.completed ? "done" : ""}>
              {editId === t.id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              ) : (
                <span onClick={() => toggleTodo(t.id)}>{t.text}</span>
              )}

              <div className="actions">
                {editId === t.id ? (
                  <button onClick={() => saveEdit(t.id)}>💾</button>
                ) : (
                  <button
                    onClick={() => {
                      setEditId(t.id);
                      setEditText(t.text);
                    }}
                  >
                    ✏️
                  </button>
                )}
                <button onClick={() => deleteTodo(t.id)}>✕</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
