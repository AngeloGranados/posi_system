import { orderByAscDescUsers, orderByUsers, Users } from "@/types/users";


const URL_API = `${process.env.NEXT_PUBLIC_API_URL}usuarios`;

interface filterOptions {
    orderField: orderByAscDescUsers;
    orderBy: orderByUsers;
    limit: number;
    page: number;
}

export async function getUsers(): Promise<Users[]> {
    const response = await fetch(`${URL_API}`, {
        credentials: "include"
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function deleteUsers(usersId: string): Promise<void> {
    const response = await fetch(`${URL_API}/${usersId}`, {
        method: "DELETE",
        credentials: "include",
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
}

export async function updateUsers(users: Users): Promise<Users> {

     const response = await fetch(`${URL_API}/admin/${users.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(users)
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function updateProfile(params: Users): Promise<void> {
    const response = await fetch(`${URL_API}/profile/admin`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(params)
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function changePassword(params: { idUser: string; newPassword: string }): Promise<void> {
    const response = await fetch(`${URL_API}/changepassword`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(params)
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function createUsers(users: Users): Promise<Users> {
 
    const response = await fetch(`${URL_API}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(users)
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function getUsersFiltered(filterOptions: filterOptions): Promise<{ data: Users[]; totalRows: number}>{

    const params = new URLSearchParams();

    if(filterOptions.limit) params.append("limit", filterOptions.limit.toString());
    if(filterOptions.page) params.append("page", filterOptions.page.toString());
    if(filterOptions.orderBy){
        switch (filterOptions.orderBy) {
            case "ByASC":
            case "ByDESC":
                if (filterOptions.orderField) {
                    params.append(filterOptions.orderBy, filterOptions.orderField);
                }
        }
    }

    const response = await fetch(`${URL_API}/filter?${params.toString()}`, {
        credentials: "include"
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}
