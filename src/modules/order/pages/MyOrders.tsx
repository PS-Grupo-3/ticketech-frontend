import "../styles/MyOrdersPage.css";
import { useState,useEffect } from "react"; 
import { getOrders } from "../api/getOrders";
import  OrderDetailsRender from "./OrderDetail";
import {getEventById} from "../../event/api/eventApi";
import "../styles/OrderDetailModal.css";
import "../styles/EventInfo.css";
import  barcode  from "../../../../public/banners/barcode.jpg";

interface Order
{
    orderId:string,
    eventId:string,
    totalAmount:number,
    transaction:string,
   
}

interface eventThumbnail
{
thumbnailUrl:string
}

export default function MyOrders() {
    const [Orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalState,setmodalState]=useState(false);
    const [selectOrder,setselectOrder]=useState<string | null>(null)
     const[thumbnail,setThumbnail]=useState<{[eventId:string]:string|null}>({})

    
     useEffect(()=>
        {
            loadOrders();
        },[]);

    const loadOrders = async ()=>
        {
            try
            {
                const data = await getOrders();
                const orderArray = Array.isArray(data) ? data : [];   
                setOrders(orderArray);
                const thumbnail : {[eventId:string]:string}={};
                await Promise.all
                (
                    orderArray.map(async (order)=>
                        {
                            try
                            {
                                const event = await getEventById(order.eventId);
                               
                                thumbnail[order.eventId]=event.thumbnailUrl;
                            }
                            catch(err)
                            {
                                console.error("Error al cargar la imagen",err);
                            }

                        })
                );
                setThumbnail(thumbnail);
            }
            catch(err)
            {
                console.error("Failed to load orders:",err);
            }
            finally
            {
                setLoading(false);
            }

        
        }

        


    return (
     <div className="MyOrdersPage">
        <div className="tittle">
        <a href="/order" className="backBtn">&lt;</a> 
        <h1> Mis compras</h1>
        </div>
        <div className="OrdersContainer" >
            {Orders.length==0 && (
                <p>Aún no hay ordenes realizadas....</p>
            )}
            {Orders.map((Order,index)=>(

                <div className="OrderCard" key={Order.orderId || index} onClick={()=>
                {
                    setselectOrder(Order.orderId);
                    setmodalState(true);
                }} >
                    {thumbnail[Order.eventId] ? (
                        <img src={thumbnail[Order.eventId]!} alt="Imagen del evento" />
                        ) : (
                        <div >Imagen no disponible</div>
                    )}
                    <div className="barCode">
                        <img src={barcode} alt="codigo de barras " />
                    </div>
                
                    </div>
            ))}
        </div>
        {modalState && selectOrder && (
        <div className="modalOverlay" onClick={() => setmodalState(false)}>
        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
          <OrderDetailsRender orderId={selectOrder}  />
        </div>
      </div>
    )}
     </div>
    );
    
}