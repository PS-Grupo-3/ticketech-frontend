import { useState, useEffect, useRef } from "react";
import type { UserResponse } from "../api/authApi";
import { getAllRoles, changeUserRole } from "../api/authApi";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import { useNotification } from "../../../shared/components/NotificationContext";
import "./styles/UserCard.css";

type Props = {
  user: UserResponse;
  loggedUserId: string;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  onRoleUpdated: (userId: string, newRole: string) => void;
};

export default function UserCard({
  user,
  loggedUserId,
  openMenuId,
  setOpenMenuId,
  onRoleUpdated
}: Props) {

  const { show } = useNotification(); // 👈 ahora lo usamos

  const [showModal, setShowModal] = useState(false);
  const [pendingRole, setPendingRole] = useState<{ id: number; name: string } | null>(null);

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

  const handleChangeRole = async (newRoleId: number, newRoleName: string) => {
    try {
      await changeUserRole(user.id, newRoleId);
      onRoleUpdated(user.id, newRoleName);
      show(`Rol actualizado correctamente a "${newRoleName}"`);
      setOpenMenuId(null);
    } catch (error) {
      console.error(error);
      show("No se pudo actualizar el rol");
    }
  };

  return (
    <div className="user-wrapper" ref={cardRef}>
      <div className="user-card">
        <span className="col-name">
          {user.name} {user.lastName} {isCurrentUser && "(Tú)"}
        </span>

        <span className="col-email">{user.email}</span>

        <span className="user-role col-role">
          {user.role}
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
              onClick={() => {
                setPendingRole({ id: r.id, name: r.name });
                setShowModal(true);
              }}
              disabled={r.name === user.role}
            >
              {r.name}
            </button>
          ))}
        </div>
      )}

      {showModal && pendingRole && (
        <ConfirmModal
          message={`¿Seguro que deseas cambiar el rol de ${user.name} ${user.lastName} a "${pendingRole.name}"?`}
          onConfirm={async () => {
            await handleChangeRole(pendingRole.id, pendingRole.name);
            setShowModal(false);
            setPendingRole(null);
          }}
          onCancel={() => {
            setShowModal(false);
            setPendingRole(null);
          }}
        />
      )}
    </div>
  );
}
