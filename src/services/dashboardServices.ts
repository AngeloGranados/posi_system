const URL_API = `${process.env.NEXT_PUBLIC_API_URL}dashboard`;

export async function getCardsTotalRegisters(): Promise<CardsTotalRegisters> {
    const response = await fetch(`${URL_API}/cardsTotalRegisters`);
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error("Failed to fetch total registers");
    }
    return data;
}