// modules/auth/pages/AuthPage.tsx
import { useEffect, useState } from "react";
import Layout from "../../../shared/components/Layout";
import { getAllUsers, parseJwt } from "../api/authApi";
import type { UserResponse } from "../api/authApi";
import UserCard from "./UserCard";

export default function AuthPage() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [error, setError] = useState<string>("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const decoded = token ? parseJwt(token) : ({} as any);
  const loggedUserId: string = decoded?.userId ?? decoded?.sub ?? "";

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch((err) => setError(err.message));
  }, []);

  const handleRoleUpdate = (userId: string, newRoleName: string) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === userId ? { ...u, role: newRoleName } : u
      )
    );
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <div className="page-title-section">
            <h1 className="page-title">Usuarios</h1>
            <p className="page-subtitle">
              Panel de usuarios registrados y cambiar roles.
            </p>
          </div>
        </div>

        <div className="user-list">
          <div className="user-list-header">
            <span className="col-name">Nombre</span>
            <span className="col-email">Email</span>
            <span className="col-role">Rol</span>
            <span className="col-actions">Acciones</span>
          </div>

          {error && <p className="error-message">{error}</p>}

          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              loggedUserId={loggedUserId}
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
              onRoleUpdated={handleRoleUpdate}
            />
          ))}

          {users.length === 0 && !error && (
            <p className="no-data">No hay usuarios registrados</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
