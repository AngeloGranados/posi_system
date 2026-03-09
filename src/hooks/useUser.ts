import UserContext from "@/context/userContext";
import { useContext } from "react";

export default function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    const { userSession, setUserSession } = context;
    return { userSession, setUserSession };
}