import React from "react";
import { UserSchema } from "../types/user";

interface Props {
  user: UserSchema | null;
}

const UserDetails = ({ user }: Props) => {
  if (!user) return null;

  return (
    <div>
      <h3>User Details</h3>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Status: {user.status}</p>
      <p>Language: {user.language}</p>
    </div>
  );
};

export default UserDetails;
