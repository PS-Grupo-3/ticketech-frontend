import { getApiClient } from "../../../core/apiClient";

const api = getApiClient("auth");

export type LoginCredentials = {
    Email: string;
    Password: string;
};

export type loginResponse = {
    token: string;
    userId: string;
    Username: string;
    role: string;
};

export type ServerResponse = {
    status: number;
    message: string;
};


function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
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
        return data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Error al cambiar la contraseña");
    }
};

export const login = async (payload: LoginCredentials): Promise<loginResponse> => {
    try {
        const url = "/User/login";

        // Backend NO devuelve string → devuelve JSON con { name, lastName, email, token }
        const { data } = await api.post(url, payload);

        if (!data || typeof data !== "object" || !data.token) {
            throw new Error("Formato de token inválido recibido del servidor.");
        }

        const token = data.token;
        localStorage.setItem("token", token);

        const decoded = parseJwt(token);

        return {
            token: token,
            userId: decoded.userId || "0",
            role: decoded.userRole || "User",
            Username: decoded.Username || data.name || "User"
        };
    } catch (error: any) {
        console.error("Error en login:", error);
        throw new Error(error.response?.data?.message || "Error al iniciar sesión");
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
        const { data } = await api.post("/User/register", payload);

        if (!data || typeof data !== "object" || !data.token) {
            throw new Error("Formato de token inválido recibido del servidor.");
        }

        const token = data.token;
        localStorage.setItem("token", token);

        const decoded = parseJwt(token);

        return {
            token: token,
            userId: decoded.userId || "0",
            role: decoded.userRole || "User",
            name: data.name
        };
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Error al registrar usuario");
    }
};

export { parseJwt };
