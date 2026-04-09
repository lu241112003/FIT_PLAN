import api from "./api";
import type { UserProfile } from "../types/user";

export async function getUserProfile(): Promise<UserProfile> {
  const { data } = await api.get("/profile");
  return data;
}

export async function updateUserProfile(
  updates: Partial<UserProfile>
): Promise<UserProfile> {
  const { data } = await api.post("/profile", updates);
  return data.profile;
}

export async function deleteUserAccount(): Promise<void> {
  await api.delete("/users/account");
}

export async function getUserStats(): Promise<any> {
  const { data } = await api.get("/users/stats");
  return data;
}
