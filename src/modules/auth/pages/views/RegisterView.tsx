import { useState } from "react";
import { useLoginSidebar } from "../hooks/useLoginSidebar";  // Importar el hook que maneja el registro

type Props = {
    Name: string;
    LastName: string;
    Phone: string;
    Email: string;
    Password: string;
    setName: (v: string) => void;
    setLastName: (v: string) => void;
    setPhone: (v: string) => void;
    setEmail: (v: string) => void;
    setPassword: (v: string) => void;
    credsError: string | null;
    successMessage: string | null;
    credsAnimation: boolean;
    shakeAnimation: boolean;
};

const RegisterView = ({
    Name, LastName, Phone, Email, Password,
    setName, setLastName, setPhone, setEmail, setPassword,
    credsError, credsAnimation, shakeAnimation, successMessage
}: Props) => {

    return (
        <div className="creds">
            {/* Nombre */}
            <input
                className={`email ${shakeAnimation ? "active" : "inactive"}`}
                type="text"
                placeholder="Nombre"
                value={Name}
                onChange={(e) => setName(e.target.value)}
            />

            {/* Apellido */}
            <input
                className={`email ${shakeAnimation ? "active" : "inactive"}`}
                type="text"
                placeholder="Apellido"
                value={LastName}
                onChange={(e) => setLastName(e.target.value)}
            />

            {/* Teléfono */}
            <input
                className={`email ${shakeAnimation ? "active" : "inactive"}`}
                type="text"
                placeholder="Teléfono"
                value={Phone}
                onChange={(e) => setPhone(e.target.value)}
            />

            {/* Correo Electrónico */}
            <input
                className={`email ${shakeAnimation ? "active" : "inactive"}`}
                type="email"
                placeholder="Correo Electrónico"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
            />

            {/* Contraseña */}
            <div className="psw_">
                <input
                    className={`psw ${shakeAnimation ? "active" : "inactive"}`}
                    type="password"
                    placeholder="Contraseña"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            {/* Error message */}
            {credsError && (
                <p className={`errormsg ${credsAnimation ? "active" : "inactive"}`}>
                    {credsError}
                </p>
            )}

            {/* Success message */}
            {successMessage && (
                <p className="successmsg active">
                    {successMessage}
                </p>
            )}
        </div>
    );
};


export default RegisterView;
