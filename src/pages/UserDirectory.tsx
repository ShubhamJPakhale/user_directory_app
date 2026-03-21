import { useState, useMemo, useEffect } from "react";
import { UserSchema } from "../types/user";
import { mockUsers } from "../mockData/mockUsers";
import useDebounce from "../hooks/useDebounce";

import SearchBar from "../components/SearchBar";
import FilterComp from "../components/FilterComp";
import UserList from "../components/UserList";
import UserDetails from "../components/UserDetail";
import AddUserForm from "../components/AddUserForm";

const getInitialUsers = (): UserSchema[] => {
  const raw = localStorage.getItem("users");
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as UserSchema[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (error) {
      console.error(
        "Failed to parse users from localStorage, using mock data.",
      );
    }
  }
  return mockUsers;
};

const UserDirectory = () => {
  const [users, setUsers] = useState<UserSchema[]>(getInitialUsers);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"" | UserSchema["role"]>("");
  const [status, setStatus] = useState<"" | UserSchema["status"]>("");
  const [selectedUser, setSelectedUser] = useState<UserSchema | null>(null);

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      return (
        (user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          user.email.toLowerCase().includes(debouncedSearch.toLowerCase())) &&
        (!role || user.role === role) &&
        (!status || user.status === status)
      );
    });
  }, [users, debouncedSearch, role, status]);

  const handleAddUser = (newUser: Omit<UserSchema, "id">) => {
    setUsers((prev) => [...prev, { ...newUser, id: Date.now() }]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>User Directory</h2>

      <SearchBar value={search} onChange={setSearch} />

      <FilterComp
        role={role}
        status={status}
        onRoleChange={setRole}
        onStatusChange={setStatus}
      />

      <UserList users={filteredUsers} onSelect={setSelectedUser} />

      <UserDetails user={selectedUser} />

      <AddUserForm onAdd={handleAddUser} />
    </div>
  );
};

export default UserDirectory;
