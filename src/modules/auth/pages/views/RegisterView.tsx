import { useState } from "react";

export default function RegisterView() {

    const [Name, setName] = useState("");
    const [LastName, setLastName] = useState("");
    const [Phone, setPhone] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");

    const [shakeAnimation, setShakeAnimation] = useState(false);
    const [credsError, setCredsError] = useState("");
    const [credsAnimation, setCredsAnimation] = useState(false);

    const showError = (msg: string): void => {
        setCredsError(msg);
        setCredsAnimation(true);
        setShakeAnimation(true);

        setTimeout(() => setShakeAnimation(false), 700);
        setTimeout(() => setCredsAnimation(false), 2000);
    };

    const handleRegister = async () => {
        if (!Name || !LastName || !Phone || !Email || !Password || !ConfirmPassword) {
            showError("Todos los campos son obligatorios");
            return;
        }

        if (Password !== ConfirmPassword) {
            showError("Las contraseñas no coinciden");
            return;
        }

        try { //HAY QUE ARREGLAR EL FETCH
            const res = await fetch("http://localhost:5029/api/v1/User/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: Name,
                    lastName: LastName,
                    phone: Phone,
                    email: Email,
                    password: Password
                })
            });
            const data = await res.json();

            if (!res.ok) {
                showError(data.message || data.error || "Error al registrar");
                return;
            }


            console.log("Registro exitoso!", data);

            // si querés limpiar el form:
            setName("");
            setLastName("");
            setPhone("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

        } catch (e) {
            showError("Error de conexión con el servidor");
        }
    };

    // ⚠ Mantengo esto porque tu footer lo usa
    (window as any).triggerRegister = handleRegister;

    return (
        <div className="creds">

            <input className={`email ${shakeAnimation ? "active" : "inactive"}`}
                type="text" placeholder="Nombre"
                value={Name} onChange={(e) => setName(e.target.value)} />

            <input className={`email ${shakeAnimation ? "active" : "inactive"}`}
                type="text" placeholder="Apellido"
                value={LastName} onChange={(e) => setLastName(e.target.value)} />

            <input className={`email ${shakeAnimation ? "active" : "inactive"}`}
                type="text" placeholder="Teléfono"
                value={Phone} onChange={(e) => setPhone(e.target.value)} />

            <input className={`email ${shakeAnimation ? "active" : "inactive"}`}
                type="text" placeholder="Correo Electrónico"
                value={Email} onChange={(e) => setEmail(e.target.value)} />

            <input className={`psw ${shakeAnimation ? "active" : "inactive"}`}
                type="password" placeholder="Contraseña"
                value={Password} onChange={(e) => setPassword(e.target.value)} />

            <input className={`psw ${shakeAnimation ? "active" : "inactive"}`}
                type="password" placeholder="Repetir Contraseña"
                value={ConfirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} />

            {credsError && (
                <p className={`errormsg ${credsAnimation ? "active" : "inactive"}`}>
                    {credsError}
                </p>
            )}
        </div>
    );
}
