import { Categories } from "@/types/categories";

const URL_API = `${process.env.NEXT_PUBLIC_API_URL}dashboard`;

export async function getCardsTotalRegisters(access_token_admin: string): Promise<CardsTotalRegisters> {
    const response = await fetch(`${URL_API}/cardsTotalRegisters`, {
        headers: {
            Cookie: `access_token_admin=${access_token_admin}`,
        },
        credentials: "include",
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error("Failed to fetch total registers");
    }
    return data;
}

export async function configDataCompany(dataCompany: CompanyData): Promise<{ message: string }> {
    const configDataCompany = new FormData();
    configDataCompany.append("companyName", dataCompany.companyName);
    configDataCompany.append("companyEmail", dataCompany.companyEmail);
    configDataCompany.append("companyPhone", dataCompany.companyPhone);
    configDataCompany.append("companyAddress", dataCompany.companyAddress);
    configDataCompany.append("companyLogo", dataCompany.companyLogo);
    configDataCompany.append("companyLogoHeader", dataCompany.companyLogoHeader);
    configDataCompany.append("companyPriceLimit", dataCompany.companyPriceLimit);
    configDataCompany.append("socials", JSON.stringify(dataCompany.socials));

    const response = await fetch(`${URL_API}/configDataCompany`, {
        method: "POST",
        body: configDataCompany,
        credentials: "include",
    });
    const data = await response.json();

    if (!response.ok || data.error) {
        throw new Error("Failed to configure company data");
    }

    return data;
}

export async function getDataCompany(): Promise<CompanyData> {
    const response = await fetch(`${URL_API}/getConfigDataCompany`, {
        credentials: "include",
    });
    let data = await response.json();

    if (!response.ok || data.error) {
        throw new Error("Failed to fetch company data");
    }

    if (typeof data === "string") {
        data = JSON.parse(data);
    }

    return data;
}

export async function configBentoCategories(configBento: Categories[]): Promise<{ message: string }> {
    const response = await fetch(`${URL_API}/configBentoCategories`, {
        method: "POST",
        credentials: "include",
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