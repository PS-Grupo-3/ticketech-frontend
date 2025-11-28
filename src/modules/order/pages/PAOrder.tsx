import "../styles/PAOrder.css";
import { useState } from "react";

import Navbar from "../../../shared/components/Navbar";
import Footer from "../../../shared/components/Footer";
export default function PAOrder() {
    const [sidebarOpen, setSidebarOpen]=useState(false);
    
    return (
        <div className="PAOrder">
            <Navbar onUserClick={()=>setSidebarOpen(false)}/>
            <div className="PAOrderBody">
            
            <div className="Content">
                <div className="title">
                    <h1>Tickets Seleccionados</h1>
                </div>
                <div className="ticketsCards">

                </div>
            </div>
            
            <div className="Summary">
                 <div className="title">
                    <h1>Resumen de compra</h1>
                 </div>
                 <div className="SummaryBody">                  
                   <h2>Productos:</h2> 
                   <h1>Total:</h1> 
                 </div>
                 <div className="Summary-Btns">
                    <button className="OrderBtn">Finalizar orden</button>
                    <button className="CancelBtn">Cancelar orden</button>
                 </div>

            </div>
            

            </div>  
            
            
            
            <Footer/>
        </div>
    );
}
