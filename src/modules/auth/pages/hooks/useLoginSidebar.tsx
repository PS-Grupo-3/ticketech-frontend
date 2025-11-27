import { useState, useEffect } from "react";
import { login, register } from "../../api/authApi";

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

    // Nuevo estado de éxito
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [view, setView] = useState<"login" | "register" | "user" | "profile">("login");
    const [user, setUser] = useState<any>(null);

    // ⭐ RESTAURAR SESIÓN
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            setUser(parsed);
            setView("user");
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
        setSuccessMessage(null); // Resetear mensaje de éxito
    };

    const closeSidebar = () => {
        if (!user) {
            resetModal();
            setView("login");
        }
        onClose();
    };

    const handlelogin = async () => {
        try {
            const result = await login({ Email, Password });
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
            setSuccessMessage("Cuenta creada con éxito ✔");  // Mostrar mensaje de éxito
            setStatus(true); // Activar la animación de éxito
            setTimeout(() => {
                setSuccessMessage(null);  // Resetear el mensaje de éxito
                setView("user");  // Redirigir a la vista de usuario
            }, 2000);  // Esperar 2 segundos para mostrar el mensaje

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
        ConfirmPassword, setConfirmPassword,
        Name, setName,
        LastName, setLastName,
        Phone, setPhone,
        credsError, credsAnimation,
        shakeAnimation,
        view, setView,
        successMessage, // Devuelves el estado de éxito
        handlelogin,
        handleRegister,
        closeSidebar,
        resetModal,
        user,
        logout
    };
};
