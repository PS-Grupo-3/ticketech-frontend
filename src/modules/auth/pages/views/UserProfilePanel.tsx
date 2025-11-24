import { useEffect, useState } from "react";
import { parseJwt, changePassword } from "../../api/authApi";
import type { ServerResponse } from "../../api/authApi";
import "../styles/userPanel.css";
import ChangePasswordView from "./ChangePassword";

type Props = {
    onClose: () => void;
};

export default function UserProfile({ onClose }: Props) {
    const [decodedUser, setDecodedUser] = useState<any>(null);
    const [changePasswordMode, setChangePasswordMode] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setDecodedUser(parseJwt(token));
        }
    }, []);

    const handleChangePassword = async (
        current: string,
        newPass: string,
        repeatPass: string
    ) => {
        if (!decodedUser) return;

        // Validaciones
        if (!current || !newPass || !repeatPass) {
            alert("Todos los campos son obligatorios");
            return;
        }
        if (newPass !== repeatPass) {
            alert("La nueva contraseña no coincide");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                userId: decodedUser.userId,
                currentPassword: current,
                newPassword: newPass,
            };
            const response: ServerResponse = await changePassword(payload);
            alert(response.message);
            setChangePasswordMode(false);
        } catch (err: any) {
            alert(err.message || "Error al cambiar la contraseña");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="SideBar open">
            {/* HEADER */}
            <div className="headerSB">
                <h2>{changePasswordMode ? "Cambiar contraseña" : "Mi perfil"}</h2>
                <button onClick={onClose}>X</button>
            </div>

            {/* BODY */}
            <div className="bodySb">
                {!changePasswordMode && (
                    <div className="creds">
                        <div className="user-field">
                            <span className="label">Nombre:</span>
                            <span className="value">{decodedUser?.Username || "—"}</span>
                        </div>
                        <div className="user-field">
                            <span className="label">Apellido:</span>
                            <span className="value">{decodedUser?.UserLastName || "—"}</span>
                        </div>
                        <div className="user-field">
                            <span className="label">Teléfono:</span>
                            <span className="value">{decodedUser?.UserPhone || "—"}</span>
                        </div>
                        <div className="user-field">
                            <span className="label">Email:</span>
                            <span className="value">{decodedUser?.email || "—"}</span>
                        </div>
                        <div className="user-field">
                            <span className="label">Rol:</span>
                            <span className="value">{decodedUser?.userRole || "—"}</span>
                        </div>
                    </div>
                )}

                {changePasswordMode && (
                    <ChangePasswordView
                        onChangePassword={handleChangePassword}
                        onCancel={() => setChangePasswordMode(false)}
                        loading={loading}
                    />
                )}
            </div>

            {/* FOOTER */}
            <div className="btns">
                {!changePasswordMode ? (
                    <>
                        <button
                            className="register"
                            onClick={() => setChangePasswordMode(true)}
                        >
                            Cambiar contraseña
                        </button>
                        <button className="login" onClick={onClose}>
                            Volver
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="login"
                            onClick={() => setChangePasswordMode(false)}
                        >
                            Volver
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
