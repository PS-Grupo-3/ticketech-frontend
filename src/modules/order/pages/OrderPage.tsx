import "../styles/OrderPage.css";
import { useNavigate } from "react-router-dom";

export default function OrderPage() {
   
 const navigate =useNavigate();
    return (
        <div className="OrderPage">                
                <button onClick={()=>navigate("/myOrders")}>Ver mis ordenes</button>  
        </div>
    );
}
