import { useState } from "react";
import { login } from "../../api/authApi";

export const useLoginSidebar = (onClose: () => void) => {

    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");

    const [credsError, setMsg] = useState<string | null>(null);
    const [credsAnimation, setStatus] = useState(false);
    const [shakeAnimation, shakeStatus] = useState(false);

    const [view, setView] = useState<"login" | "register" | "user">("login");

    const resetModal = () => {
        setEmail("");
        setPassword("");
        setMsg(null);
        setStatus(false);
        shakeStatus(false);
    };

    const closeSidebar = () => {
        resetModal();
        setView("login");
        onClose();
    };

    const handlelogin = async () => {
        const result = await login({ Email, Password });
        if (result) {
            resetModal();
            setView("user");
            onClose();
        } else {
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

    return {
        Email, setEmail,
        Password, setPassword,
        credsError, credsAnimation,
        shakeAnimation,
        view, setView,
        handlelogin,
        closeSidebar,
        resetModal
    };
};
