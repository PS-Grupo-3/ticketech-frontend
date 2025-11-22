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
        resetModal,
        user,        // <-- usuario actual
        logout       // <-- logout
    } = useLoginSidebar(onClose);

    return (
        <>
            <div
                className={`overlay ${open ? "active" : ""}`}
                onClick={closeSidebar}
            ></div>

            <div className={`SideBar ${open ? "open" : ""}`}>
                
                {/* HEADER */}
                <div className="headerSB">
                    <h2>
                        {view === "login" && "Iniciar sesión en Ticketech"}
                        {view === "register" && "Crear una cuenta"}
                        {view === "user" && "Bienvenido a tu cuenta"}
                    </h2>
                    <button onClick={closeSidebar}>X</button>
                </div>

                {/* BODY */}
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

                    {/* UserView NO recibe props, saca user y logout desde el hook */}
                    {view === "user" && <UserView user={user} logout={logout} />}

                </div>

                {/* FOOTER BUTTONS */}
                <div className="btns">
                    
                    {/* LOGIN BUTTONS */}
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

                    {/* REGISTER BUTTONS */}
                    {view === "register" && (
                        <>
                            <button
                                className="register"
                                onClick={() => (window as any).triggerRegister()}
                            >
                                Crear cuenta
                            </button>

                            <button
                                className="login"
                                onClick={() => setView("login")}
                            >
                                Volver al inicio de sesión
                            </button>
                        </>
                    )}

                    {/* USER BUTTONS */}
                    {view === "user" && (
                        <button
                            className="login"
                            onClick={logout}
                        >
                            Cerrar sesión
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default LoginSidebar;
