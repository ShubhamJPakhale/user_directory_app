export type UserRole = "Admin" | "Editor" | "Viewer";
export type UserStatus = "Active" | "Inactive";

export interface UserSchema {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  language: string;
}

