"use client";

import { useState, useEffect } from "react";
import TaskItem from "@/components/TaskItem";
import { useRouter } from "next/navigation";
import fetchApi from "@/lib/fetchApi";
import { Task } from "@/lib/type";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [titles, setTitles] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [validationError, setValidationError] = useState("");
  const [editValidationError, setEditValidationError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const router = useRouter();

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

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const { ok } = await fetchApi("/api/logout", "POST");
      if (ok) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
      return;
    }
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
  }, [router]);

  return (
    <div className="max-w-xl mx-auto my-10 p-4">
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
        <button type="button" onClick={handleLogout}>
          ログアウト
        </button>
      </div>
    </div>
  );
}
