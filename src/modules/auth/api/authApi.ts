
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

export type ServerResponse = {
    status: number;
    message: string;
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

export type ChangePasswordPayload = {
    currentPassword: string;
    newPassword: string;
};

export const changePassword = async (payload: ChangePasswordPayload): Promise<ServerResponse> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token de autenticación");

    console.log("Payload enviado:", payload);

    try {
        const { data } = await api.patch<ServerResponse>(
            "/User/change-password",
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log("Respuesta del servidor:", data);
        return data;
    } catch (err: any) {

        throw new Error(err.response?.data?.message || "Error al cambiar la contraseña");
    }

};

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

export type RegisterPayload = {
    name: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
};

export type RegisterResponse = {
    token: string;
    userId: string;
    name: string;
    role: string;
};

export const register = async (payload: RegisterPayload): Promise<RegisterResponse> => {
    try {
        const { data } = await api.post<string>("/User/register", payload);

        if (!data || typeof data !== "string") {
            throw new Error("Formato de token inválido recibido del servidor.");
        }

        localStorage.setItem("token", data);

        const decoded = parseJwt(data);

        return {
            token: data,
            userId: decoded.userId || "0",
            role: decoded.userRole || "User",
            name: payload.name,
        };
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Error al registrar usuario");
    }
};



export { parseJwt };
