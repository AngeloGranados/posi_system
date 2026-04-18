import { getDataCompany } from "@/services/dashboardServices";
import ConfigModal from "./(components-ui)/ConfigModal";

export default async function EmpresaConfig() {

    const dataCompany: CompanyData = await getDataCompany();

    if (!dataCompany) {
        return;
    }

    return (
        <div className="pb-20">
            <ConfigModal dataCompany={dataCompany} />
        </div>
    )
}