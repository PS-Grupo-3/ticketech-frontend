import { useState, useEffect } from "react";
import { login } from "../../api/authApi";

export const useLoginSidebar = (onClose: () => void) => {

    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");

    const [credsError, setMsg] = useState<string | null>(null);
    const [credsAnimation, setStatus] = useState(false);
    const [shakeAnimation, shakeStatus] = useState(false);

    const [view, setView] = useState<"login" | "register" | "user">("login");

    const [user, setUser] = useState<any>(null);

    // ⭐ RESTAURAR SESIÓN
    useEffect(() => {
        const savedUser = localStorage.getItem("user");  // guardado como JSON
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            setUser(parsed);
            setView("user");
        }
    }, []);

    const resetModal = () => {
        setEmail("");
        setPassword("");
        setMsg(null);
        setStatus(false);
        shakeStatus(false);
    };

    const closeSidebar = () => {
        // ❗ YA NO resetees la vista si el usuario está logueado
        if (!user) {
            resetModal();
            setView("login");
        }

        onClose();
    };

    const handlelogin = async () => {
        try {
            const result = await login({ Email, Password });

            // guardamos el user DEVUELTO POR TU API
            localStorage.setItem("user", JSON.stringify(result));

            setUser(result);
            setView("user");
            resetModal();

        } catch {
            setMsg("Email o contraseña invalida");
            setStatus(true);
            shakeStatus(true);
            setTimeout(() => {
                setStatus(false);
                shakeStatus(false);
                setMsg(null);
            }, 1500);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        resetModal();
        setView("login");
    };

    return {
        Email, setEmail,
        Password, setPassword,
        credsError, credsAnimation,
        shakeAnimation,
        view, setView,
        handlelogin,
        closeSidebar,
        resetModal,
        user,
        logout
    };
};
