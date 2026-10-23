import {api} from "./api.js";

export async function login(payload) {
  const {data: {data}} = await api.post("/login", payload);

  return data;
};

export async function auth() {
  const {data: {data}} = await api.post("/auth");

  return data;
};