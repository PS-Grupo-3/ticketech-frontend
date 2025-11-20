import { getApiClient } from "../../../core/apiClient";
import { decodeToken } from "../components/DecodeToken";

const api = getApiClient("order");



export const getOrders = async () => {  
   
    const userToken = localStorage.getItem("token");
    if(userToken == null )
        {return[];} 
    const payload = decodeToken(userToken);
    
    if(payload==null)
        {return[];}

    const userId = payload.userId; 

    const params : any={userId};


    const {data} = await api.get("/Order",{
        params:{userId},
        headers:
        {
            Authorization:`Bearer ${userToken}`
        }
    });
    
    return data;

};