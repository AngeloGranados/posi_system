import { getDataCompany } from "@/services/dashboardServices";
import ConfigModal from "./(components-ui)/ConfigModal";

export default async function EmpresaConfig() {

    const dataCompany: CompanyData = await getDataCompany();

    console.log("Data Company in EmpresaConfig:", dataCompany);

    return (
        <div className="pb-20">
            <ConfigModal dataCompany={dataCompany} />
        </div>
    )
}