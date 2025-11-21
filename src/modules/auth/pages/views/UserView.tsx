import "../styles/userPanel.css";

type Props = {
    user: {
        name: string;
        email?: string;
        role: string;
        userId: string;
        token: string;
    } | null;
    logout: () => void;
};

const UserView = ({ user, logout }: Props) => {
    if (!user) return null;

    return (
        <div className="userPanel">
            <div className="userPanel-info">
                <div className="userPanel-avatar">
                    <img 
                        src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                        alt="user avatar"
                    />
                </div>

                <h3 className="userPanel-name">Hola, {user.name}</h3>
                <p className="userPanel-email">{user.email || "Sin correo"}</p>

                <div className="userPanel-roleBox">
                    <span className="userPanel-role">{user.role}</span>
                </div>
            </div>

            <div className="userPanel-section">
                <button className="userPanel-btn">Mis compras</button>
                <button className="userPanel-btn">Mi perfil</button>
                {(user.role === "Admin" || user.role === "SuperAdmin") && (
                    <div className="userPanel-section">
                        <button className="userPanel-btn">Panel de eventos</button>
                        <button className="userPanel-btn">Usuarios</button>
                    </div>
                )}

                {user.role === "SuperAdmin" && (
                    <div className="userPanel-section">
                        <h4>Super Administrador</h4>
                        <button className="userPanel-btn danger">Configuraciones avanzadas</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserView;
