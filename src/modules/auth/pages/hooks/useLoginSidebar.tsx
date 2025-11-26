import { useState, useEffect } from "react";
import { login, register } from "../../api/authApi";

export const useLoginSidebar = (onClose: () => void) => {

    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [Name, setName] = useState("");
    const [LastName, setLastName] = useState("");
    const [Phone, setPhone] = useState("");


    const [credsError, setMsg] = useState<string | null>(null);
    const [credsAnimation, setStatus] = useState(false);
    const [shakeAnimation, shakeStatus] = useState(false);

    const [view, setView] =
        useState<"login" | "register" | "user" | "profile">("login");


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
        setName("");
        setLastName("");
        setPhone("");
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

    const handleRegister = async () => {
        try {
            const data = await register({
                name: Name,
                lastName: LastName,
                phone: Phone,
                email: Email,
                password: Password
            });

            setUser(data);
            setMsg("Cuenta creada con éxito ✔");
            setStatus(true);

            setTimeout(() => {
                setMsg(null);
                setView("user");
            }, 1000);

        } catch (err: any) {
            setMsg(err.message);
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
        Name, setName,
        LastName, setLastName,
        Phone, setPhone,
        credsError, credsAnimation,
        shakeAnimation,
        view, setView,
        handlelogin,
        handleRegister,
        closeSidebar,
        resetModal,
        user,
        logout
    };

};
