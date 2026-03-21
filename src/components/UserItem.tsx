import React from "react";
import { UserSchema } from "../types/user";

interface Props {
  user: UserSchema;
  onClick: (user: UserSchema) => void;
}

const UserItem: React.FC<Props> = React.memo(({ user, onClick }) => {
  return (
    <li onClick={() => onClick(user)}>
      {user.name} - {user.email} - {user.role} - {user.status}
    </li>
  );
});

export default UserItem;
