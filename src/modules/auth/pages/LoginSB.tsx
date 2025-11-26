import "./styles/loginSB.css";

import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
import UserView from "./views/UserView";
import UserProfile from "./views/UserProfilePanel";

import { useLoginSidebar } from "./hooks/useLoginSidebar";

type Props = {
    open: boolean;
    onClose: () => void;
};

const LoginSidebar = ({ open, onClose }: Props) => {

    const {
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
    } = useLoginSidebar(onClose);

    return (
        <>
            <div
                className={`overlay ${open ? "active" : ""}`}
                onClick={closeSidebar}
            >
            </div>

            <div className={`SideBar ${open ? "open" : ""}`}>
                <div className="headerSB">
                    <h2>
                        {view === "login" && "Iniciar sesión en Ticketech"}
                        {view === "register" && "Crear una cuenta"}
                        {view === "user" && "Bienvenido a tu cuenta"}
                        {view === "profile" && "Mi perfil"}
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

                    {view === "register" && (
                        <RegisterView
                            Name={Name}
                            setName={setName}
                            LastName={LastName}
                            setLastName={setLastName}
                            Phone={Phone}
                            setPhone={setPhone}
                            Email={Email}
                            setEmail={setEmail}
                            Password={Password}
                            setPassword={setPassword}
                            credsError={credsError}
                            credsAnimation={credsAnimation}
                            shakeAnimation={shakeAnimation}
                            handleRegister={handleRegister}
                        />
                    )}

                    {view === "user" && (
                        <UserView
                            user={user}
                            logout={logout}
                            setView={setView}
                        />
                    )}

                    {view === "profile" && (
                        <UserProfile onClose={() => setView("user")} />
                    )}

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

                            <button
                                className="login"
                                onClick={() => setView("login")}
                            >
                                Volver al inicio de sesión
                            </button>
                        </>
                    )}

                    {view === "user" && (
                        <button className="login" onClick={logout}>
                            Cerrar sesión
                        </button>
                    )}

                    {view === "profile" && (
                        <>
                            <button className="register">
                                Cambiar contraseña
                            </button>

                            <button
                                className="login"
                                onClick={() => setView("user")}
                            >
                                Volver
                            </button>
                        </>
                    )}

                </div>
            </div>
        </>
    );
};

export default LoginSidebar;
