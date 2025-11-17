
import { getApiClient } from "../../../core/apiClient";

const api = getApiClient("auth");

export type LoginCredentials=
{
    Email:string,
    Password:string;
}
export type loginResponse=
{
    token:string,
    userId:string;
    name: string;
    role: string;
        
};

export type serverResponse = 
{
    status:number,
    message:string;

};

function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return {};
    }
}


export const login = async (payload:LoginCredentials): Promise<loginResponse> =>
    {
        try
        {
        const url = "/User/login";
        const {data}= await api.post<string>(url, payload);
        const token = data;

        if (!token || typeof token !== 'string') {
            throw new Error("Formato de token inválido recibido del servidor.");
        }

        localStorage.setItem("token", token);

        const decoded = parseJwt(token);

        return {
            token: token,
            userId: decoded.userId || "0",
            role: decoded.userRole || "User", // Aquí sacamos el rol real
            name: "Usuario" // Nombre por defecto
        };
        } catch (error: any) {
        console.error("Error en login:", error);
        throw new Error(error.response?.data?.error || "Error al iniciar sesión");
    }
};
