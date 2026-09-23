"use client";
import { useState } from "react";
import { Task } from "../app/page";

export default function TaskItem({
  task,
  onDelete,
  onPut,
  onStartEdit,
  editingId,
}: {
  task: Task;
  onDelete: (id: number) => void;
  onStartEdit: (id: number) => void;
  onPut: (id: number, title: string, description: string) => void;
  editingId: number | null;
}) {
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description ?? "",
  );

  return (
    <div>
      {task.id === editingId ? (
        <>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <input
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <button onClick={() => onPut(task.id, editTitle, editDescription)}>
            保存
          </button>
        </>
      ) : (
        <>
          {task.title}
          {task.description}
          <button
            type="button"
            onClick={() => {
              onStartEdit(task.id);
              setEditTitle(task.title);
              setEditDescription(task.description ?? "");
            }}
          >
            編集
          </button>
          <button type="button" onClick={() => onDelete(task.id)}>
            削除
          </button>
        </>
      )}
    </div>
  );
}
