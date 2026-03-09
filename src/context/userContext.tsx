'use client';

import { UserSession } from "@/services/loginServices";
import { Users } from "@/types/users";
import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserContextType {
    userSession: Users | null;
    setUserSession: React.Dispatch<React.SetStateAction<Users | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserContextProvider({ children }: { children: React.ReactNode }) {

    const [ userSession, setUserSession ] = useState<Users | null>(null);
    const router = useRouter();

    async function fetchLoginUser(){
        try {
            const response = await UserSession();
            if(response && response.user) {
                setUserSession(response.user);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            router.push("/signin");
        }
    }

    useEffect(() => {
        fetchLoginUser();
    }, []);
    
    return (
        <UserContext.Provider value={{ userSession, setUserSession }}>
            {children}
        </UserContext.Provider>
    )

}

export default UserContext;