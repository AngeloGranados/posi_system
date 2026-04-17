import { ReactNode } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@/icons";

interface ConfigItemCardProps {
    title: string;
    icon: ReactNode;
    url: string;
}

export default function ConfigItemCard({ title, icon, url }: ConfigItemCardProps) {
    return (
        <Link href={url} className="border border-gray-300 dark:bg-gray-700 rounded-2xl p-10 mb-6 hover:bg-gray-100 dark:hover:bg-gray-600 transition-bg cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mb-4">
            {icon}
            </div>
            <h2 className="text-gray-800 text-[1.5rem] font-[600] mb-2">{title}</h2>
            <span className="flex items-center gap-2 text-red-500 font-[700]">Abrir Editor <ArrowRightIcon /></span>
        </Link>
    )
}