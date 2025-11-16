
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
    name: string;
    role: "Current" | "Admin" | "SuperAdmin";
        
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


        }
        catch (error: any) {
            console.error("Error en login:", error.response?.data || error.message);
             throw new Error(error.response?.data?.error || "Email o contraseña inválida");
}
        
        

        


    }
