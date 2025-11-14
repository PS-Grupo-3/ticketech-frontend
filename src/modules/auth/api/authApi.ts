// placeholder temporal
import { getApiClient } from "../../../core/apiClient";

const api = getApiClient("auth");

type loginPayload=
{
    Email:string,
    Password:string;
}
type loginResponse=
{
    token:string,
    userId:string;
}
type serverResponse = 
{
    status:number,
    message:string;

};


export const login = async (payload:loginPayload)=>
    {
        try
        {
        const url = "/User/login";
        const {data}= await api.post<loginResponse>(url,payload);
        if(data)
        {
            
            localStorage.setItem("token",data.token);
            return data;
        }
        else{alert("Info incorrecta");}


        }
        catch(error:any)
        {
            console.error("Ocurrio un error inesperado");

        }
        
        

        


    }
