import { orderBy, orderByAscDesc, orderByAscDescParams } from "@/types/produts";
import { useEffect, useState } from "react";

interface ButtonOrderAscDescProps {
    onClick: () => void,
    isAsc: boolean,
    isActive: boolean
}

export default function ButtonOrderAscDesc({ onClick, isAsc, isActive }: ButtonOrderAscDescProps) {

    return (
        <button onClick={onClick} className={`flex items-center ${isActive ? "text-blue-500" : "text-gray-500"}`}>
            <span className="mr-1">{isAsc ? "▲" : "▼"}</span>
        </button>
    );
}