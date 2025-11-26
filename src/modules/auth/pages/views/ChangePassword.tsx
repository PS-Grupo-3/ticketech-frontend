import { useState, useEffect } from "react";
import { parseJwt, changePassword } from "../../api/authApi";
import type { ServerResponse } from "../../api/authApi";
import "../styles/userPanel.css";

type Props = {
    onChangePassword: (current: string, newPass: string, repeatPass: string) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
};


export default function ChangePasswordView({ onCancel }: Props) {
  const [decodedUser, setDecodedUser] = useState<any>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setDecodedUser(parseJwt(token));
    }
  }, []);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !repeatPassword) {
      setError("Todos los campos son obligatorios");
      setSuccess(null);
      return;
    }
    if (newPassword !== repeatPassword) {
      setError("La nueva contraseña no coincide");
      setSuccess(null);
      return;
    }

    if (!decodedUser?.userId) {
      setError("Usuario no válido");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const payload = {
        userId: decodedUser.userId,
        currentPassword,
        newPassword,
      };
      const response: ServerResponse = await changePassword(payload);

      if (response.message) {
          setSuccess(response.message);
          setError(null);
          setLoading(false);

          setTimeout(() => {
            onCancel();
          }, 1000);

          return;
      }

      setError(response.message || "Error al cambiar la contraseña");
      setLoading(false);

    } catch (err: any) {
      setError(err.message || "Error al cambiar la contraseña");
      setLoading(false);
    }

  };

  return (
    <div className="SideBar open">
      <div className="headerSB">
        <h2>Cambiar contraseña</h2>
        <button onClick={onCancel}>X</button>
      </div>

      <div className="bodySb creds">

        <input
          className={`psw ${error ? "active" : "inactive"}`}
          type="password"
          placeholder="Contraseña actual"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <input
          className={`psw ${error ? "active" : "inactive"}`}
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          className={`psw ${error ? "active" : "inactive"}`}
          type="password"
          placeholder="Repetir nueva contraseña"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />

        {error && (
          <p className={`errormsg ${error ? "active" : "inactive"}`}>
            {error}
          </p>
        )}

        {success && (
          <p className="successmsg active">
            {success}
          </p>
        )}

      </div>

      <div className="btns">
        <button className="register" onClick={handleSubmit} disabled={loading}>
          {loading ? "Cambiando..." : "Cambiar"}
        </button>
        <button className="login" onClick={onCancel}>
          Volver
        </button>
      </div>
    </div>
  );
}
