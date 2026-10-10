export default async function fetchApi(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: object,
) {
  const token = localStorage.getItem("token") || "";
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    headers: token
      ? {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        }
      : {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
    method: method,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) {
    return { ok: res.ok, json: null };
  } else {
    return { ok: res.ok, json: await res.json() };
  }
}
