type Props = {
    Email: string;
    Password: string;
    setEmail: (v: string) => void;
    setPassword: (v: string) => void;
    credsError: string | null;
    credsAnimation: boolean;
    shakeAnimation: boolean;
};

const LoginView = ({
    Email, Password, setEmail, setPassword,
    credsError, credsAnimation, shakeAnimation
}: Props) => {

    return (
        <div className="creds">
            <input
                className={`email ${shakeAnimation ? "active" : "inactive"}`}
                type="text"
                placeholder="Correo Electrónico"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <div className="psw_">
                <input
                    className={`psw ${shakeAnimation ? "active" : "inactive"}`}
                    type="password"
                    placeholder="Contraseña"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <a href="#">Olvidé mi contraseña</a>
            </div>

            {credsError && (
                <p className={`errormsg ${credsAnimation ? "active" : "inactive"}`}>
                    {credsError}
                </p>
            )}
        </div>
    );
};

export default LoginView;
