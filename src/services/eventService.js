import {api} from "./api.js";

export async function fetchEvents() {
  const { data: {data} } = await api.get("/event");
  return data;
}

export async function fetchEvent(id) {
  const { data: {data} } = await api.get(`/event/${id}`);
  return data;
}

export async function checkEditAccess(eventId) {
  await api.post(`/event/edit/${eventId}`);
}

export async function checkViewAccess(eventId, password) {
  await api.post(`/event/view/${eventId}`, {
    password,
  });
}

export async function createEvent(formData) {
  await api.post("/event", formData);
}