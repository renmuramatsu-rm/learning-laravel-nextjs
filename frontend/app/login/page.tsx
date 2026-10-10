"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import fetchApi from "@/lib/fetchApi";

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

export default function Login() {
  const [validationError, setValidationError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
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
        localStorage.setItem("token", json.token);
        setValidationError("");
        router.push("/tasks");
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
        localStorage.setItem("token", json.token);
        setValidationError("");
        router.push("/tasks");
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

  return isRegistering ? (
    <div className="max-w-xl mx-auto my-10 p-4">
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
    <div className="max-w-xl mx-auto my-10 p-4">
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
  );
}
