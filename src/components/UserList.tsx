import { UserSchema } from "../types/user";
import UserItem from "./UserItem";

interface Props {
  users: UserSchema[];
  onSelect: (user: UserSchema) => void;
}

const UserList = ({ users, onSelect }: Props) => {
  return (
    <ul>
      {users.map((user) => (
        <UserItem key={user.id} user={user} onClick={onSelect} />
      ))}
    </ul>
  );
}


export default UserList;