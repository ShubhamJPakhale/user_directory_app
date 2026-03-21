import { useState } from "react";
import { UserForm, validateUser } from "../utils/validation";
import { UserRole, UserStatus } from "../types/user";

interface Props {
  onAdd: (user: UserForm) => void;
}

export default function AddUserForm({ onAdd }: Props) {
  const [form, setForm] = useState<UserForm>({
    name: "",
    email: "",
    role: "Admin",
    status: "Active",
    language: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserForm, string>>>(
    {},
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const err = validateUser(form);
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }

    onAdd(form);
    setForm({
      name: "",
      email: "",
      role: "Admin",
      status: "Active",
      language: "",
    });
    setErrors({});
  };

  const errorstyle = {
    color: "red",
    fontWeight: "bold",
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add User</h3>

      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <span style={errorstyle}>{errors.name}</span>

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <span style={errorstyle}>{errors.email}</span>

      <select
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
      >
        <option value="Admin">Admin</option>
        <option value="Editor">Editor</option>
        <option value="Viewer">Viewer</option>
      </select>
      <span style={errorstyle}>{errors.role}</span>

      <select
        value={form.status}
        onChange={(e) =>
          setForm({ ...form, status: e.target.value as UserStatus })
        }
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      <input
        placeholder="Language"
        value={form.language}
        onChange={(e) => setForm({ ...form, language: e.target.value })}
      />

      <button type="submit">Add User</button>
    </form>
  );
}
