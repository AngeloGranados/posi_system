'use client';

import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import useUser from "@/hooks/useUser";

export default function UserInfoContainer() {
    const { userSession, setUserSession } = useUser();
    return (
        <>
            <UserMetaCard userSession={userSession} />
            <UserInfoCard userSession={userSession} setUserSession={setUserSession} />
        </>
    )
}