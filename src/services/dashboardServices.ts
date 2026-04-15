import { Categories } from "@/types/categories";

const URL_API = `${process.env.NEXT_PUBLIC_API_URL}dashboard`;

export async function getCardsTotalRegisters(): Promise<CardsTotalRegisters> {
    const response = await fetch(`${URL_API}/cardsTotalRegisters`);
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error("Failed to fetch total registers");
    }
    return data;
}

export async function configBentoCategories(configBento: Categories[]): Promise<{ message: string }> {
    const response = await fetch(`${URL_API}/configBentoCategories`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ configBento }),
    });
    const data = await response.json();

    if (!response.ok || data.error) {
        throw new Error("Failed to configure bento categories");
    }

    return data;
}