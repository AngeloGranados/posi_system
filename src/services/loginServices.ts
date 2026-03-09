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
    if (!response.ok) {
        throw new Error("Error fetching login");
    }
    return response.json();
}

export async function LogoutAdmin() {
    const response = await fetch(`${URL_API}/logoutAdmin`, {
        method: "POST",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Error fetching logout");
    }
    return response.json();
}

export async function UserSession() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}usuarios/usersession/admin`, {
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}
