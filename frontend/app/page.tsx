"use client";

import { useState, useEffect } from "react";
import TaskItem from "../components/TaskItem";

export type Task = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [titles, setTitles] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [validationError, setValidationError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    let success: boolean;
    fetch("http://172.23.85.221:8000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: titles, description: descriptions }),
    })
      .then((res) => {
        success = res.ok;
        return res.json();
      })
      .then((json) => {
        if (success) {
          setTasks([...tasks, json.data]);
          setTitles("");
          setDescriptions("");
          setValidationError("");
        } else {
          setValidationError(json.message);
        }
      });
  };

  const handleDelete = (id: number) => {
    fetch(`http://172.23.85.221:8000/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      const success = res.ok;
      if (success) {
        setTasks(tasks.filter((task) => task.id !== id));
      }
    });
  };

  const handleStartEdit = (id: number) => {
    setEditingId(id);
  };

  const handlePut = (id: number, title: string, description: string) => {
    let success: boolean;
    fetch(`http://172.23.85.221:8000/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
      }),
    })
      .then((res) => {
        success = res.ok;
        return res.json();
      })
      .then((json) => {
        if (success) {
          setTasks(
            tasks.map((task) =>
              task.id === id ? { ...task, title, description } : task,
            ),
          );

          setEditingId(null);
          setValidationError("");
        } else {
          setValidationError(json.message);
        }
      });
  };

  const handleLogin = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    let success: boolean;
    fetch(`http://172.23.85.221:8000/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((res) => {
        success = res.ok;
        return res.json();
      })
      .then((json) => {
        if (success) {
          setEmail("");
          setPassword("");
          setToken(json.token);
          localStorage.setItem("token", json.token);
          setValidationError("");
        } else {
          setValidationError(json.message);
        }
      });
  };

  const handleRegister = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    let success: boolean;
    fetch(`http://172.23.85.221:8000/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
      }),
    })
      .then((res) => {
        success = res.ok;
        return res.json();
      })
      .then((json) => {
        if (success) {
          setName("");
          setEmail("");
          setPassword("");
          setPasswordConfirmation("");
          setToken(json.token);
          localStorage.setItem("token", json.token);
          setValidationError("");
        } else {
          setValidationError(json.message);
        }
      });
  };

  const handleToggle = () => {
    setIsRegistering(!isRegistering);
  };

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetch(`http://172.23.85.221:8000/api/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      const success = res.ok;
      if (success) {
        setToken("");
        localStorage.removeItem("token");
      }
    });
  };

  useEffect(() => {
    if (!token) return;
    let success: boolean;
    fetch("http://172.23.85.221:8000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        success = res.ok;
        return res.json();
      })
      .then((json) => {
        if (success) {
          setTasks(json.data);
        } else {
          setTasks([]);
        }
      });
  }, [token]);

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
  }, []);

  return (
    <div>
      {token ? (
        <div>
          <h1>タスク一覧</h1>
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <TaskItem
                  task={task}
                  onDelete={handleDelete}
                  onStartEdit={handleStartEdit}
                  onPut={handlePut}
                  editingId={editingId}
                />
              </li>
            ))}
          </ul>
          <h2>{validationError}</h2>
          <form onSubmit={handleSubmit}>
            <input value={titles} onChange={(e) => setTitles(e.target.value)} />
            <textarea
              value={descriptions}
              onChange={(e) => setDescriptions(e.target.value)}
            ></textarea>
            <button>課題内容の追加</button>
          </form>
          <button onClick={handleLogout}>ログアウト</button>
        </div>
      ) : isRegistering ? (
        <div>
          <h2>{validationError}</h2>
          <form onSubmit={handleRegister}>
            <input value={name} onChange={(e) => setName(e.target.value)} />
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            <button>登録</button>
          </form>
          <button onClick={handleToggle}>ログインページに切り替え</button>
        </div>
      ) : (
        <div>
          <h2>{validationError}</h2>
          <form onSubmit={handleLogin}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button>ログイン</button>
          </form>
          <button onClick={handleToggle}>登録ページに切り替え</button>
        </div>
      )}
    </div>
  );
}
