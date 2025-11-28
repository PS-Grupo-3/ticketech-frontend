import { useState, useEffect, useRef } from "react";
import type { UserResponse } from "../api/authApi";
import { getAllRoles } from "../api/authApi";
import "./styles/UserCard.css";

type Props = {
  user: UserResponse;
  loggedUserId: string;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
};

export default function UserCard({
  user,
  loggedUserId,
  openMenuId,
  setOpenMenuId
}: Props) {
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  const isCurrentUser = user.id === loggedUserId;
  const menuOpen = openMenuId === user.id;

  useEffect(() => {
    getAllRoles().then(setRoles).catch(console.error);
  }, []);

  const toggleMenu = () => {
    if (isCurrentUser) return;
    setOpenMenuId(menuOpen ? null : user.id);
  };

  const handleRoleChange = (newRole: string) => {
    console.log("Nuevo rol seleccionado:", newRole);
    setOpenMenuId(null);
  };

  return (
    <div className="user-wrapper" ref={cardRef}>
      <div className="user-card">
        <span className="col-name">
          {user.name} {user.lastName} {isCurrentUser && "(Tú)"}
        </span>

        <span className="col-email">{user.email}</span>

        <span className={`user-role col-role ${user.role?.toLowerCase()}`}>
          {user.role === "current" ? "Usuario" : user.role}
        </span>

        <div className="user-actions">
          <button
            className={`view-button ${isCurrentUser ? "disabled" : ""}`}
            disabled={isCurrentUser}
            onClick={toggleMenu}
          >
            Cambiar rol
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="user-dropdown">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => handleRoleChange(r.name)}
              disabled={r.name === user.role}
            >
              {r.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
