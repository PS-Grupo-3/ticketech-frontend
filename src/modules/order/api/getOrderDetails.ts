import { getApiClient } from "../../../core/apiClient";



const api = getApiClient("order");



export const getOrdersDetails = async (orderId:string) => {  
   
    const userToken = localStorage.getItem("token");
    if(userToken == null )
        {return[];} 

    const params : any={orderId};


    const {data} = await api.get(`/Order/${orderId}`,{
        headers:
        {
            Authorization:`Bearer ${userToken}`
        }
    });

    return data;

};