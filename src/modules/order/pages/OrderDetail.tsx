 import {getOrdersDetails} from "../api/getOrderDetails";
 import { useState,useEffect } from "react";
 import { decodeToken } from "../components/DecodeToken";
 import {getEventById} from "../../event/api/eventApi";


interface Props {
  orderId: string;
}

interface Ticket
{
    detailId:string,
    ticketId:string,
    unitPrice:number,
    quantity:number,
}
interface PaymentType
{
    id:number,
    name:string,
}
interface OrderDetail
{
   orderId:string,
   eventId:string,
   details:Ticket[],
   totalAmount:number,
   discountAmount:number,
   taxAmount:number,
   paymentType:PaymentType,
   transaction:string,
}
interface eventDetail
{
name:string,
category:string,
categoryType:string,
time:Date,
address:string,
bannerImageUrl:string,
}

interface UserInfo
{
    userName:string,
    userLastName:string,
    userPhone:string,
}

 
 export default function OrderDetailsRender({orderId}:Props)
 {
    const[orderDetail,setOrderDetail]=useState<OrderDetail | null>(null)
    const[eventSelected,setEvent]=useState<eventDetail|null>(null)
    const[loading,setloading]=useState(true);
    const[userData,setUserData]=useState<UserInfo| null>(null)

     useEffect(()=>{
            const loadUserInfo = ()=>
            {
                try
                {
                    const token = localStorage.getItem("token");
                    if(token==null)
                        {return null;}

                    const Userdata = decodeToken(token); 
                    setUserData(Userdata);
                }
                catch(err)
                {
                    console.error("Fallo al cargar los detalles del usuario:",err);
                }
            }
            loadUserInfo();
        
        },[])

    useEffect(()=>
        {
        const loadDetails = async()=>
            {
                try
                {
                    const data = await getOrdersDetails(orderId);
                    setOrderDetail(data);
                }
                catch(err)
                {
                    console.error("Fallo al cargar los detalles de la orden:",err);
                }
                finally
                {setloading(false);}

            }
            loadDetails();

        },[orderId]);

        useEffect(()=>
            {
                const loadEvent = async ()=>
                    {
                        try
                        {
                            if(orderDetail?.eventId==null)
                                {
                                    return null;
                                }
                            const event = await getEventById(orderDetail?.eventId);
                            setEvent(event);
                        }
                        catch(err)
                        {
                        console.error("Fallo al cargar los detalles del evento:",err);
                        }
                    }
                    loadEvent();
            },[orderDetail]);



        if (loading) {
        return <div className="OrderDetails">Cargando...</div>;
        }     

        if (!orderDetail) {
            return <div className="OrderDetails" style=
            {
                {display:"flex",
                 justifyContent:"center",
                 alignItems:"center",
                }
            }>No se encontraron detalles.</div>;
        }

    return(
         <div className="OrderDetails">

        <div className="OrderInfoContainer">

        <div className="EventImg">
           {eventSelected?.bannerImageUrl?
           (
            <img  src={eventSelected.bannerImageUrl} alt={eventSelected.name} />

           ):
           (
            "Imagen no disponible"
           )}
           <div className="ImgText">
           <span> <p> #{orderDetail.orderId.toLocaleUpperCase()}</p></span>
           <span> <h1>{eventSelected?.name}</h1></span>
           <span>  {eventSelected?.address}</span>
           <span> Fecha: {new Date(eventSelected?.time!).toLocaleDateString("es-AR")}</span>
           <span> Horario: {new Date(eventSelected?.time!).toLocaleTimeString("es-AR")}</span>
           </div>
           
        
        </div>
        


        <div className="InfoOrder">
        {
                orderDetail?.details?.map((ticket,index) =>(
                <div className="infotickets" key={ticket.ticketId || index}>
                    
                    <span>Nombre del sector</span>
                    <span >{ticket.quantity} x ${ticket.unitPrice}</span>
                
                    
                </div>  
             ))


        }
        <div className="PriceInfo">
        
        <div className="PriceInfoLine">
            <span>Total:</span>
            <span>${orderDetail.totalAmount}</span>
        </div>
        
        <div className="PriceInfoLine">
            <span>Método de pago:</span>
            <span> {orderDetail.paymentType.name}</span>
        </div>
        
        <div className="PriceInfoLine">
            <span>Transacción:</span>
            <span> {orderDetail.transaction}</span>
        </div>
        
        </div>
        
        <div className="UserInfo">
        
        <div className="UserInfoLine">
            <span>Nombre:</span>
            <span> {userData?.userName} {userData?.userLastName}</span>
        </div>

        <div className="UserInfoLine">
            <span>Telefono:</span>
            <span> {userData?.userPhone}</span>
        </div>

        </div>     
        </div> 

        </div>

        

        
        
        </div>

        
    );
 }