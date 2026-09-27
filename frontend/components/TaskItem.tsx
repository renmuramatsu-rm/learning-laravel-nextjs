"use client";
import { useState } from "react";
import { Task } from "../app/page";

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
      className={`rounded-2xl border p-4 flex justify-between items-center ${task.id === editingId ? "bg-blue-100" : "bg-white"}`}
    >
      {task.id === editingId ? (
        <>
          <div className="flex flex-col gap-2">
            {editValidationError && (
              <p className="text-red-500">{editValidationError}</p>
            )}
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="font-bold border p-1"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="text-sm text-gray-500 border h-20 w-80"
            />
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                onCancel();
              }}
              className="border mx-3 px-1"
            >
              キャンセル
            </button>
            <button
              onClick={() => {
                onPut(task.id, editTitle, editDescription);
              }}
              className="border mx-3 px-2"
            >
              保存
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <div className="font-bold">{task.title}</div>
            {task.description && (
              <div className="text-sm text-gray-500">{task.description}</div>
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
              className="border mx-3 px-2 hover:bg-sky-100"
            >
              編集
            </button>
            <button
              type="button"
              onClick={() => {
                onDelete(task.id);
              }}
              className="border mx-3 px-2 hover:bg-sky-100"
            >
              削除
            </button>
          </div>
        </>
      )}
    </div>
  );
}
