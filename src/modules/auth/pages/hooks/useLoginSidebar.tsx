import { useState, useEffect } from "react";
import { login, register, parseJwt } from "../../api/authApi";

export const useLoginSidebar = (onClose: () => void) => {
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");
    const [Name, setName] = useState("");
    const [LastName, setLastName] = useState("");
    const [Phone, setPhone] = useState("");
    const [credsError, setMsg] = useState<string | null>(null);
    const [credsAnimation, setStatus] = useState(false);
    const [shakeAnimation, shakeStatus] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [sessionMessage, setSessionMessage] = useState<string | null>(null);

    const [view, setView] = useState<"login" | "register" | "user" | "profile">("login");
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (savedUser && token) {
            const payload = parseJwt(token);
            if (payload && payload.exp * 1000 > Date.now()) {
                setUser(JSON.parse(savedUser));
                setView("user");
                startTokenTimer(token);
            } else {
                logout("La sesión ha expirado. Por favor, inicia sesión nuevamente.");
            }
        }
    }, []);

    const resetModal = () => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        setLastName("");
        setPhone("");
        setMsg(null);
        setStatus(false);
        shakeStatus(false);
        setSuccessMessage(null);
        setSessionMessage(null);
    };

    const closeSidebar = () => {
        if (!user) {
            resetModal();
            setView("login");
        }
        onClose();
    };

    const startTokenTimer = (token: string) => {
        const payload = parseJwt(token);
        if (!payload || !payload.exp) return;

        const expiryTime = payload.exp * 1000;
        const now = Date.now();
        const timeout = expiryTime - now;

        if (timeout > 0) {
            setTimeout(() => {
                logout("La sesión ha expirado. Por favor, inicia sesión nuevamente.");
            }, timeout);
        } else {
            logout("La sesión ha expirado. Por favor, inicia sesión nuevamente.");
        }
    };

    const handlelogin = async () => {
        try {
            const result = await login({ Email, Password });
            localStorage.setItem("user", JSON.stringify(result));
            localStorage.setItem("token", result.token);

            setUser(result);
            setView("user");
            resetModal();

            startTokenTimer(result.token);
        } catch (err: any) {
            const message = err.message || "Error al iniciar sesión";

            setMsg(message);
            setStatus(true);
            shakeStatus(true);

            setTimeout(() => {
                setStatus(false);
                shakeStatus(false);
                setMsg(null);
            }, 2000);
        }
    };


    const handleRegister = async () => {
        if (!Name || !LastName || !Phone || !Email || !Password) {
            setMsg("Todos los campos son obligatorios");
            setStatus(true);
            shakeStatus(true);
            setTimeout(() => {
                setStatus(false);
                shakeStatus(false);
                setMsg(null);
            }, 1500);
            return;
        }

        try {
            const data = await register({
                name: Name,
                lastName: LastName,
                phone: Phone,
                email: Email,
                password: Password
            });

            setUser(data);

            localStorage.setItem("user", JSON.stringify(data));
            if (data.token) {
                localStorage.setItem("token", data.token);
                startTokenTimer(data.token);
            }

            setSuccessMessage("Cuenta creada con éxito");
            setStatus(true);

            setTimeout(() => {
                setSuccessMessage(null);
                setView("user");
            }, 2000);

        } catch (err: any) {
            setMsg(err.message || "Error al registrar usuario");
            setStatus(true);
            shakeStatus(true);
            setTimeout(() => {
                setStatus(false);
                shakeStatus(false);
                setMsg(null);
            }, 1500);
        }
    };


    const logout = (message?: string) => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        resetModal();
        setView("login");
        if (message) setSessionMessage(message);
    };

    return {
        Email, setEmail,
        Password, setPassword,
        ConfirmPassword, setConfirmPassword,
        Name, setName,
        LastName, setLastName,
        Phone, setPhone,
        credsError, credsAnimation,
        shakeAnimation,
        view, setView,
        successMessage,
        sessionMessage,
        handlelogin,
        handleRegister,
        closeSidebar,
        resetModal,
        user,
        logout
    };
};