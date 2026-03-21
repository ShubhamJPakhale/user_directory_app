import { UserRole, UserStatus } from "../types/user";

interface Props {
  role: UserRole | "";
  status: UserStatus | "";
  onRoleChange: (role: UserRole | "") => void;
  onStatusChange: (status: UserStatus | "") => void;
}

const FilterComp = ({ role, status, onRoleChange, onStatusChange }: Props) => {
  return (
    <div>
      <select
        value={role}
        onChange={(e) => onRoleChange(e.target.value as UserRole | "")}
      >
        <option value="">All Roles</option>
        <option value="Admin">Admin</option>
        <option value="Editor">Editor</option>
        <option value="Viewer">Viewer</option>
      </select>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as UserStatus | "")}
      >
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>
  );
};

export default FilterComp;
