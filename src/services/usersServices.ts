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
    if (!response.ok) {
        throw new Error("Error fetching users");
    }
    return response.json();
}

export async function deleteUsers(usersId: number): Promise<void> {
    const response = await fetch(`${URL_API}/${usersId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Error deleting users");
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

    if (!response.ok) {
        throw new Error("Error updating users");
    }

    return response.json();
}

export async function updateProfile(params: Users): Promise<void> {
    const response = await fetch(`${URL_API}/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(params)
    });
    if (!response.ok) {
        throw new Error("Error editing profile");
    }
}

export async function changePassword(params: { idUser: number; newPassword: string }): Promise<void> {
    const response = await fetch(`${URL_API}/changepassword`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(params)
    });
    if (!response.ok) {
        throw new Error("Error changing password");
    }
    return response.json();
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

    if (!response.ok) {
        throw new Error("Error creating users");
    }

    return response.json();
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
    if (!response.ok) {
        throw new Error("Error fetching filtered users");
    }
    return response.json();
}
