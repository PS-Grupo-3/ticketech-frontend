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

export type ChangePasswordPayload = {
    currentPassword: string;
    newPassword: string;
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

export type UserResponse = {
    id: string;
    name: string;
    lastName: string;
    email: string;
    role: string;
};

export type RoleResponse = {
    id: number;
    name: string;
};


function logReq(label: string, url: string, payload?: unknown) {
  console.groupCollapsed(`[API] ${label}: ${url}`);
  if (payload !== undefined) console.log("payload:", payload);
  console.groupEnd();
}
function logRes(label: string, url: string, ms: number, res: unknown) {
  console.groupCollapsed(`[API] ${label} OK: ${url} (${ms.toFixed(1)} ms)`);
  console.log("response:", res);
  console.groupEnd();
}
function logErr(label: string, url: string, ms: number, err: any) {
  console.groupCollapsed(`[API] ${label} FAIL: ${url} (${ms.toFixed(1)} ms)`);
  console.error(err);
  if (err?.response) {
    console.log("status:", err.response.status);
    console.log("data:", err.response.data);
  }
  console.groupEnd();
}

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

export const getAllUsers = async (): Promise<UserResponse[]> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token de autenticación");

    try {
        const { data } = await api.get<UserResponse[]>(
            "/User/users",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Error al obtener los usuarios");
    }
};

export const getAllRoles = async (): Promise<RoleResponse[]> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token de autenticación");

    try {
        const { data } = await api.get<RoleResponse[]>(
            "/Role",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Error al obtener los roles");
    }
};

export const changeUserRole = async (userId: string, newRole: number) => {
  const url = `/User/change-role/${userId}`;
  logReq("PATCH Change User Role", url, { newRole });
  const t0 = performance.now();
  try {
    const { data } = await api.patch(url, { newRole });
    logRes("PATCH Change User Role", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("PATCH Change User Role", url, performance.now() - t0, err);
    throw err;
  }
};

export { parseJwt };
