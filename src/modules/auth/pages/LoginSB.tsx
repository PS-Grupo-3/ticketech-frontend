import "./styles/loginSB.css";

import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
import UserView from "./views/UserView";

import { useLoginSidebar } from "./hooks/useLoginSidebar";

type Props = {
    open: boolean;
    onClose: () => void;
};

const LoginSidebar = ({ open, onClose }: Props) => {

    const {
        Email, setEmail,
        Password, setPassword,
        credsError, credsAnimation,
        shakeAnimation,
        view, setView,
        handlelogin,
        closeSidebar,
        resetModal
    } = useLoginSidebar(onClose);

    return (
        <>
            <div className={`overlay ${open ? "active" : ""}`} onClick={closeSidebar}></div>

            <div className={`SideBar ${open ? "open" : ""}`}>
                <div className="headerSB">
                    <h2>
                        {view === "login" && "Iniciar sesión en Ticketech"}
                        {view === "register" && "Crear una cuenta"}
                        {view === "user" && "Bienvenido a tu cuenta"}
                    </h2>
                    <button onClick={closeSidebar}>X</button>
                </div>

                <div className="bodySb">
                    {view === "login" && (
                        <LoginView
                            Email={Email}
                            Password={Password}
                            setEmail={setEmail}
                            setPassword={setPassword}
                            credsError={credsError}
                            credsAnimation={credsAnimation}
                            shakeAnimation={shakeAnimation}
                        />
                    )}

                    {view === "register" && <RegisterView />}
                    {view === "user" && <UserView />}
                </div>

                <div className="btns">
                    {view === "login" && (
                        <>
                            <button
                                className="login"
                                onClick={handlelogin}
                                disabled={Email === "" || Password === ""}
                            >
                                Iniciar Sesión
                            </button>

                            <button
                                className="register"
                                onClick={() => {
                                    resetModal();
                                    setView("register");
                                }}
                            >
                                Registrarse
                            </button>
                        </>
                    )}

                    {view === "register" && (
                        <>
                            <button
                                className="register"
                                onClick={() => (window as any).triggerRegister()}
                            >
                                Crear cuenta
                            </button>

                            <button className="login" onClick={() => setView("login")}>
                                Volver al inicio de sesión
                            </button>
                        </>
                    )}

                    {view === "user" && (
                        <button className="login" onClick={closeSidebar}>
                            Cerrar
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default LoginSidebar;
