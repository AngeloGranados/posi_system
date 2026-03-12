import { Users } from "@/types/users";


const URL_API = `${process.env.NEXT_PUBLIC_API_URL}login`;

export async function LoginAdmin(email: string, contrasena: string): Promise<{user: Users, token: string}> {
    const response = await fetch(`${URL_API}/loginAdmin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            email,
            contrasena
        })
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function LogoutAdmin() {
    const response = await fetch(`${URL_API}/logoutAdmin`, {
        method: "POST",
        credentials: "include",
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function UserSession() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}usuarios/usersession/admin`, {
        credentials: 'include'
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}
