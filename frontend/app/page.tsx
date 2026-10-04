"use client";

import { useState, useEffect } from "react";
import TaskItem from "../components/TaskItem";
import fetchApi from "@/lib/fetchApi";

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

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingId !== null) {
        const answer = window.confirm(
          "編集中のタスク内容が削除されますがよろしいですか？",
        );
        if (!answer) {
          return;
        }
      }
      const { ok, json } = await fetchApi("/api/tasks", "POST", {
        title: titles,
        description: descriptions,
      });
      if (ok) {
        setTasks([...tasks, json.data]);
        setTitles("");
        setDescriptions("");
        setValidationError("");
        handleCancel();
      } else {
        setValidationError(json.message);
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { ok } = await fetchApi(`/api/tasks/${id}`, "DELETE");
      if (ok) {
        setTasks(tasks.filter((task) => task.id !== id));
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const handleStartEdit = (id: number) => {
    setEditingId(id);
    setValidationError("");
    setEditValidationError("");
  };

  const handlePut = async (id: number, title: string, description: string) => {
    try {
      const { ok, json } = await fetchApi(`/api/tasks/${id}`, "PUT", {
        title,
        description,
      });
      if (ok) {
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
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const handleCancel = (): void => {
    setEditingId(null);
    setEditValidationError("");
  };

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { ok, json } = await fetchApi("/api/login", "POST", {
        email: email,
        password: password,
      });

      if (ok) {
        setEmail("");
        setPassword("");
        setToken(json.token);
        localStorage.setItem("token", json.token);
        setValidationError("");
      } else {
        setValidationError(json.message);
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const handleRegister = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { ok, json } = await fetchApi("/api/register", "POST", {
        name: name,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
      });
      if (ok) {
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
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const handleToggle = () => {
    setIsRegistering(!isRegistering);
  };

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const { ok } = await fetchApi("/api/logout", "POST");
      if (ok) {
        setToken("");
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const { ok, json } = await fetchApi("/api/tasks", "GET");
        if (ok) {
          setTasks(json.data);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error("エラーが発生しました:", error);
      }
    };
    fetchData();
  }, [token]);

  /* eslint-disable react-hooks/set-state-in-effect
　--  リロード時にログイン認証を維持するための記載
  --  useStateの初期化関数を使用すると、サーバーにはlocalStorageがないため、サーバーとブラウザで画面が変わりハイドレーションエラーとなる
  -- ２回レンダリングのためブラウザで無駄なレンダリングが一回増えるが、小規模開発のため今回は無視する*/
  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
  }, []);
  /* eslint-enable */

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
