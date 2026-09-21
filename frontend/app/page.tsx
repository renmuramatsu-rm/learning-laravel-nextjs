'use client';

import { useState, useEffect } from 'react';

type Task = {
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
  const [editingTitles, setEditingTitles] = useState("");
  const [editingDescriptions, setEditingDescriptions] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    let success;
    fetch('http://172.23.85.221:8000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ token }` },
      body: JSON.stringify({ title: titles , description: descriptions }),

    })
      .then((res) => {
        success = res.ok;
        return (res.json());
      })
      .then((json) => {
        if (success) {
          setTasks([...tasks, json.data]);
          setTitles("");
          setDescriptions("");
          setValidationError("");
        }
        else{
          setValidationError(json.message)
        }
      });
  };

  const handleDelete = (id) => {
    fetch(`http://172.23.85.221:8000/api/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => {
        const success = res.ok;
        if (success) {
          setTasks(tasks.filter((task) =>task.id !== id))
        }
      })
  }

  const handleIdSet = (task) => {
    setEditingId(task.id);
    setEditingTitles(task.title);
    setEditingDescriptions(task.description);
  }

  const handlePut = (id) => {
    let success;
    fetch(`http://172.23.85.221:8000/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: editingTitles,
        description: editingDescriptions,
      })
    })
        .then((res) => {
          success = res.ok;
          return (res.json());
        })
        .then((json) => {
          if (success) {
            setTasks(tasks.map(
            (task) => task.id === editingId ? {...task,  title: json.data.title, description: json.data.description } : task
          ));

            setEditingId(null);
            setEditingTitles("");
            setEditingDescriptions("");
            setValidationError("");
        }
          else {
            setValidationError(json.message)
          }
        })
  }

  const handleLogin = (e) => {
    e.preventDefault();
    let success;
      fetch(`http://172.23.85.221:8000/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email , password: password }),
      })
      .then((res) => {
        success = res.ok;
        return (res.json());
      })
      .then((json) => {
        if (success) {
          setEmail("");
          setPassword("");
          setToken(json.token);
          localStorage.setItem('token', json.token);
          setValidationError("");
        }
        else{
          setValidationError(json.message)
        }
  })
  }

  useEffect(() => {
    if (!token) return;
    fetch('http://172.23.85.221:8000/api/tasks', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => setTasks(json.data));
  }, [token]);

  useEffect(() => {
    setToken(localStorage.getItem('token') || "")
  },[])

  return (
    <div>
    {token ? (
    <div>
      <h1>タスク一覧</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.id === editingId ? (
            <>
              <input value={editingTitles} onChange={(e) => setEditingTitles(e.target.value)} />
              <input value={editingDescriptions} onChange={(e) => setEditingDescriptions(e.target.value)} />
              <button onClick={()=>handlePut(task.id)}>保存</button>
            </>
            ) : (
            <>
              {task.title}
              {task.description}
              <button type="button" onClick={() => handleIdSet(task)}>編集</button>
              <button type="button" onClick={()=>handleDelete(task.id)}>削除</button>
            </>
            )}
            </li>
        ))}
      </ul>
      <h2>{ validationError }</h2>
      <form onSubmit={handleSubmit}>
        <input value={titles} onChange={(e) => setTitles(e.target.value)} />
        <textarea value={descriptions} onChange={(e) => setDescriptions(e.target.value)}></textarea>
        <button >タスクを追加</button>
      </form>
    </div>
  ) : (
    <div>
      <h2>{validationError}</h2>
      <form  onSubmit={handleLogin}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <input value={password} onChange={(e) => setPassword(e.target.value)} />
        <button>ログインボタン</button>
      </form>
    </div>
  )}
  </div>
  );
}
