import "../styles/userPanel.css";
import { Link } from "react-router-dom";

type Props = {
    user: {
        name: string;                
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

                <div className="userPanel-roleBox">
                    <span className="userPanel-role">
                        Rol: {user.role === "Current" ? "Usuario normal" : user.role}
                    </span>
                </div>
            </div>

            <div className="userPanel-section">
                <button className="userPanel-btn">Mi perfil</button>
                <Link to="/order" className="userPanel-btn">
                    Mis compras
                </Link>
            </div>
            {(user.role === "Admin" || user.role === "SuperAdmin") && (
                <div className="userPanel-section">
                    <h4>Administrador</h4>
                    <Link to="/event" className="userPanel-btn">
                        Panel de eventos
                    </Link>
                </div>
            )}
            {user.role === "SuperAdmin" && (
                <div className="userPanel-section">
                    <h4>Super Administrador</h4>
                    <Link to="/venue" className="userPanel-btn">
                        Panel de venues
                    </Link>
                </div>
            )}
        </div>
    );
};

export default UserView;
