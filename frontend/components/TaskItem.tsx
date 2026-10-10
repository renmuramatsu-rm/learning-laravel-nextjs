"use client";
import { useState } from "react";
import { Task } from "@/lib/type";

export default function TaskItem({
  task,
  onDelete,
  onPut,
  onStartEdit,
  editingId,
  editValidationError,
  onCancel,
}: {
  task: Task;
  onDelete: (id: number) => void;
  onStartEdit: (id: number) => void;
  onPut: (id: number, title: string, description: string) => void;
  editingId: number | null;
  editValidationError: string;
  onCancel: () => void;
}) {
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description ?? "",
  );

  return (
    <div
      className={`rounded-2xl border p-4 flex justify-between items-center ${task.id === editingId ? "bg-sky-100 dark:bg-sky-800" : "bg-white dark:bg-gray-700"}`}
    >
      {task.id === editingId ? (
        <>
          <div className="flex flex-col gap-2">
            {editValidationError && (
              <p className="text-red-500 dark:text-red-300">
                {editValidationError}
              </p>
            )}
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="font-bold border p-1 text-gray-800 dark:text-gray-300"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="text-sm text-gray-500 border h-20 w-80 dark:text-gray-400"
            />
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                onCancel();
              }}
              className="border mx-3 px-1 dark:text-gray-200"
            >
              キャンセル
            </button>
            <button
              onClick={() => {
                onPut(task.id, editTitle, editDescription);
              }}
              className="border mx-3 px-2 dark:text-gray-200"
            >
              保存
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <div className="font-bold dark:text-gray-200">{task.title}</div>
            {task.description && (
              <div className="text-sm text-gray-500 dark:text-gray-300">
                {task.description}
              </div>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                onStartEdit(task.id);
                setEditTitle(task.title);
                setEditDescription(task.description ?? "");
              }}
              className="border mx-3 px-2 hover:bg-sky-100 dark:text-gray-200 dark:hover:bg-sky-500"
            >
              編集
            </button>
            <button
              type="button"
              onClick={() => {
                onDelete(task.id);
              }}
              className="border mx-3 px-2 hover:bg-sky-100 dark:text-gray-200 dark:hover:bg-sky-500"
            >
              削除
            </button>
          </div>
        </>
      )}
    </div>
  );
}
