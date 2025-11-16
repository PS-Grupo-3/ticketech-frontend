import { useState } from "react";
import { login } from "../api/authApi"; 
import "./styles/loginSB.css";


type Props =
{
    open:boolean,
    onClose:()=>void;
};

const LoginSidebar = ({open, onClose}: Props)=>
    {
        
    const [Email,setEmail]=useState("");
    const [Password,setpsw]=useState("");
    const [credsError,setMsg]=useState<string|null>(null);
    const [credsAnimation,setStatus]=useState(false);
    const [shakeAnimation,shakeStatus]=useState(false)
    const handlelogin = async ()=> 
        {
            const result = await login({Email,Password});
            if(result)
                {
                    onClose(); //Cierro el sidebar
                    setEmail("");
                    setpsw("");
                }
            else
            {
             setMsg("Email o contraseña invalida");
             setStatus(true);
             shakeStatus(true);
             setTimeout(() => {
             setStatus(false);
             shakeStatus(false);
             setTimeout(() => setMsg(""), 500); 
            }, 1500);
            }

        };
    

return(
<>
    
    <div className={`overlay ${open ? "active" : ""}`} onClick={onClose}></div>
    <div className={`SideBar ${open ? "open" : ""}`}>
    <div className="headerSB">
        <h1> Bienvenido, iniciá sesión en ticketech</h1>
        <button onClick={onClose}>X</button> 
    </div>
    <div className="bodySb">
            <h1>Complete los datos correspondientes</h1>
            <div className="creds">
            <input className={`email ${shakeAnimation ? "active" : "inactive"}`} type="text" placeholder="Correo Electrónico" value={Email} onChange={(e)=>setEmail(e.target.value)} />
            <div className="psw_">
            <input className={`psw ${shakeAnimation ? "active" : "inactive"}`} type="password" placeholder="Contraseña" value={Password} onChange={(p)=>setpsw(p.target.value)} />  
            <a href="#">Olvidé mi contraseña</a>
            </div>
            {credsError && <p className={`errormsg ${credsAnimation ? "active" : "inactive"}`}>{credsError}</p>}    


            </div>
    </div>
    <div className="btns">
        <button className="login" onClick={handlelogin} disabled={Email==""||Password=="" } value={Password}> Iniciar Sesión</button>
        <button className="register">Registrarse</button>
    </div>
    
    </div>
 




</>
)
};


export default LoginSidebar;