import { getApiClient } from "../../../core/apiClient";

const api = getApiClient("auth");

export type LoginCredentials = {
    Email: string;
    Password: string;
};

export type loginResponse = {
    token: string;
    userId: string;
    role: string;
    name: string;
    lastName: string;
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
    role: string;
    name: string;
    lastName: string;
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
  const url = `/User/change-password`;
  const t0 = performance.now();
  logReq("PATCH Change Password", url, payload);
  try {
    const { data } = await api.patch(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    logRes("PATCH Change Password", url, performance.now() - t0, data);
    return data;
  } catch (err: any) {
    const message = err.response?.data?.error || "Error al cambiar la contraseña";
    logErr("PATCH Change Password", url, performance.now() - t0, {
      error: err,
      message
    });
    throw new Error(message);
  }
};

export const login = async (payload: LoginCredentials): Promise<loginResponse> => {
  const url = "/User/login";
  const t0 = performance.now();
  logReq("POST Login", url, payload);
  try {
    const { data } = await api.post(url, payload);
    if (!data || typeof data !== "object" || !data.token) {
      throw new Error("Formato de token inválido recibido del servidor.");
    }
    const token = data.token;
    localStorage.setItem("token", token);
    const decoded = parseJwt(token);
    const response: loginResponse = {
        token,
        userId: decoded.userId || "0",
        role: decoded.userRole || "User",
        name: data.name || decoded.name || "Usuario",
        lastName: data.lastName || decoded.lastName || ""
    };
    logRes("POST Login", url, performance.now() - t0, response);
    return response;
  } catch (err: any) {
    const message = err.response?.data?.error || "Error al iniciar sesión";
    logErr("POST Login", url, performance.now() - t0, {
      error: err,
      message
    });
    throw new Error(message);
  }
};

export const register = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const url = "/User/register";
  const t0 = performance.now();
  logReq("POST Register", url, payload);
  try {
    const { data } = await api.post(url, payload);
    if (!data || typeof data !== "object" || !data.token) {
      throw new Error("Formato de token inválido recibido del servidor.");
    }
    const token = data.token;
    localStorage.setItem("token", token);
    const decoded = parseJwt(token);

    logRes("POST Register", url, performance.now() - t0, data);
    return {
        token,
        userId: decoded.userId || "0",
        role: decoded.userRole || "User",
        name: data.name || "Usuario",
        lastName: data.lastName || ""
    };
  } catch (err: any) {
    const message = err.response?.data?.error || "Error al registrar usuario";
    logErr("POST Register", url, performance.now() - t0, {
      error: err,
      message
    });
    throw new Error(message);
  }
};

export const getAllUsers = async (): Promise<UserResponse[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token de autenticación");
  const url = "/User/users";
  const t0 = performance.now();
  logReq("GET Users", url);
  try {
    const { data } = await api.get<UserResponse[]>(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    logRes("GET Users", url, performance.now() - t0, data);
    return data;
  } catch (err: any) {
    const message = err.response?.data?.error || "Error al obtener los usuarios";
    logErr("GET Users", url, performance.now() - t0, { error: err, message });
    throw new Error(message);
  }
};

export const getAllRoles = async (): Promise<RoleResponse[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token de autenticación");
  const url = "/Role";
  const t0 = performance.now();
  logReq("GET Roles", url);
  try {
    const { data } = await api.get<RoleResponse[]>(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    logRes("GET Roles", url, performance.now() - t0, data);
    return data;
  } catch (err: any) {
    const message = err.response?.data?.error || "Error al obtener los roles";
    logErr("GET Roles", url, performance.now() - t0, { error: err, message });
    throw new Error(message);
  }
};

export const getRoleById = async (id: number): Promise<RoleResponse> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token de autenticación");

  const url = `/Role/${id}`; // asumimos que tu API tiene endpoint GET /Role/{id}
  const t0 = performance.now();
  logReq("GET Role by ID", url);

  try {
    const { data } = await api.get<RoleResponse>(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    logRes("GET Role by ID", url, performance.now() - t0, data);
    return data;
  } catch (err: any) {
    const message = err.response?.data?.error || `Error al obtener el rol con id ${id}`;
    logErr("GET Role by ID", url, performance.now() - t0, { error: err, message });
    throw new Error(message);
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
