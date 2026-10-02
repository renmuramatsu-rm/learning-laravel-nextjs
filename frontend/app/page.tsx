"use client";

import { useState, useEffect } from "react";
import TaskItem from "../components/TaskItem";

export type Task = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
};

const baseFormClasses =
  "m-auto p-8 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-700";
const baseAreaClasses = "mb-4";
const baseInputClasses =
  "border border-gray-300 rounded-md shadow-sm mt-1 w-full px-4 py-2 bg-white dark:bg-gray-600";
const baseLabelClasses =
  "block text-sm font-medium text-gray-800 dark:text-gray-200";
const baseButtonClasses =
  "w-full bg-sky-500 text-white py-2 px-4 rounded-md shadow hover:bg-sky-600 dark:bg-sky-800 dark:hover:bg-sky-900 dark:text-gray-200";
const baseToggleClasses =
  "w-full text-sm mt-10 text-center mx-auto dark:text-gray-200";
const baseToggleButtonClasses =
  "text-sky-600 underline px-2 hover:bg-sky-100 dark:hover:bg-sky-700 dark:text-sky-400";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [titles, setTitles] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [validationError, setValidationError] = useState("");
  const [editValidationError, setEditValidationError] = useState("");
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
    if (editingId !== null) {
      const answer = window.confirm(
        "編集中のタスク内容が削除されますがよろしいですか？",
      );
      if (!answer) {
        return;
      }
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
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
          handleCancel();
        } else {
          setValidationError(json.message);
        }
      });
  };

  const handleDelete = (id: number) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`, {
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
    setValidationError("");
    setEditValidationError("");
  };

  const handlePut = (id: number, title: string, description: string) => {
    let success: boolean;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`, {
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
          setEditValidationError("");
        } else {
          setEditValidationError(json.message);
        }
      });
  };

  const handleCancel = (): void => {
    setEditingId(null);
    setEditValidationError("");
  };

  const handleLogin = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    let success: boolean;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
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
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
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
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
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
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
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
    <div className="max-w-xl mx-auto my-10 p-4">
      {token ? (
        <div>
          <h1 className="text-xl font-bold">タスク一覧</h1>
          <ul className="flex flex-col gap-4 dark:text-gray-300">
            {tasks.map((task) => (
              <li key={task.id}>
                <TaskItem
                  task={task}
                  onDelete={handleDelete}
                  onStartEdit={handleStartEdit}
                  onPut={handlePut}
                  editingId={editingId}
                  editValidationError={editValidationError}
                  onCancel={handleCancel}
                />
              </li>
            ))}
          </ul>
          {validationError && (
            <p className="text-red-500 dark:text-red-300">{validationError}</p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between m-4">
              <div className="flex flex-col gap-2">
                <input
                  value={titles}
                  onChange={(e) => setTitles(e.target.value)}
                  className="border px-2 font-bold p-1 text-black dark:text-gray-300 dark:bg-gray-600"
                />
                <textarea
                  className="border px-2 text-sm text-gray-500 h-20 w-80 dark:text-gray-300 dark:bg-gray-600"
                  value={descriptions}
                  onChange={(e) => setDescriptions(e.target.value)}
                ></textarea>
              </div>
              <div>
                <button className="border px-2 text-black dark:text-gray-300 dark:bg-gray-600">
                  課題内容の追加
                </button>
              </div>
            </div>
          </form>
          <button onClick={handleLogout}>ログアウト</button>
        </div>
      ) : isRegistering ? (
        <div>
          {validationError && (
            <p className="text-red-500 dark:text-red-300">{validationError}</p>
          )}
          <form onSubmit={handleRegister} className={baseFormClasses}>
            <div className={baseAreaClasses}>
              <label className={baseLabelClasses}>
                名前
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={baseInputClasses}
                />
              </label>
            </div>
            <div className={baseAreaClasses}>
              <label className={baseLabelClasses}>
                メールアドレス
                <input
                  value={email}
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className={baseInputClasses}
                />
              </label>
            </div>
            <div className={baseAreaClasses}>
              <label className={baseLabelClasses}>
                パスワード
                <input
                  value={password}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className={baseInputClasses}
                />
              </label>
            </div>
            <div className={baseAreaClasses}>
              <label className={baseLabelClasses}>
                パスワード確認用
                <input
                  value={passwordConfirmation}
                  type="password"
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className={baseInputClasses}
                />
              </label>
            </div>
            <button className={baseButtonClasses}>登録</button>
            <p className={baseToggleClasses}>
              アカウントをお持ちの方は
              <button
                type="button"
                onClick={handleToggle}
                className={baseToggleButtonClasses}
              >
                ログイン
              </button>
            </p>
          </form>
        </div>
      ) : (
        <div>
          {validationError && (
                <p className="text-red-500 dark:text-red-300">{validationError}</p>
          )}
          <form onSubmit={handleLogin} className={baseFormClasses}>
            <div className={baseAreaClasses}>
              <label className={baseLabelClasses}>
                メールアドレス
                <input
                  value={email}
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className={baseInputClasses}
                />
              </label>
            </div>
            <div className={baseAreaClasses}>
              <label className={baseLabelClasses}>
                パスワード
                <input
                  value={password}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className={baseInputClasses}
                />
              </label>
            </div>
            <button className={baseButtonClasses}>ログイン</button>
            <p className={baseToggleClasses}>
              アカウントをお持ちでない方は
              <button
                type="button"
                onClick={handleToggle}
                className={baseToggleButtonClasses}
              >
                登録
              </button>
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
