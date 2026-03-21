import { UserSchema } from "../types/user";

export type UserForm = Omit<UserSchema, "id">;

export const validateUser = (form: UserForm) => {
  const errors: Partial<Record<keyof UserForm, string>> = {};

  if (!form.name) errors.name = "Name required";
  if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Invalid email";
  if (!form.role) errors.role = "Role required";

  return errors;
};
