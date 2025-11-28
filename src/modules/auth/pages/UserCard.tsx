import { Link } from "react-router-dom";
import type { UserResponse } from "../api/authApi";
import "./styles/UserCard.css";

type Props = {
  user: UserResponse;
  loggedUserId: string;
};

export default function UserCard({ user, loggedUserId }: Props) {
  const isCurrentUser = user.id === loggedUserId;

  return (
    <div className="user-card">
      <span className="col-name">
        {user.name} {user.lastName}
      </span>

      <span className="col-email">
        {user.email}
      </span>

      <span className={`user-role col-role ${user.role?.toLowerCase()}`}>
        {user.role}
      </span>

      <div className="user-actions">
        <Link
          to={`/admin/users/${user.id}`}
          className={`view-button ${isCurrentUser ? "disabled" : ""}`}
          onClick={(e) => isCurrentUser && e.preventDefault()}
        >
          Cambiar role
        </Link>
      </div>
    </div>
  );
}
