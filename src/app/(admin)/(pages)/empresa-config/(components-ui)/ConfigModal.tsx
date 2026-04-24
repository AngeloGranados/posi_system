'use client'

import { useEffect, useRef, useState } from "react";
import FormInfoCompany from "./FormInfoCompany";
import RedComunityCards from "./RedComunityCards";
import { configDataCompany } from "@/services/dashboardServices";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const SwalAlert = withReactContent(Swal);

interface ConfigModalProps {
    dataCompany: CompanyData;
}

export default function ConfigModal({ dataCompany }: ConfigModalProps) {

    const [FormData, setFormData] = useState<FormDataType>({
        companyName: dataCompany.companyName || "",
        companyEmail: dataCompany.companyEmail || "",
        companyPhone: dataCompany.companyPhone || "",
        companyLogo: dataCompany.companyLogo || new File([], ""),
        companyAddress: dataCompany.companyAddress || "",
        companyPriceLimit: dataCompany.companyPriceLimit || ""
    });

    const dataCachedRef = useRef(dataCompany || {});

    const [FormDataSocials, setRedesSociales] = useState<Record<RedSocial, string>>(dataCompany.socials || {});
    
    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function handleRedesSocialesChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setRedesSociales(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function handleDiscard() {

        SwalAlert.fire({
            title: "¿Estás seguro?",
            text: "Se perderán los cambios no guardados.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, descartar",
            cancelButtonText: "No, cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                setFormData(dataCachedRef.current);
                setRedesSociales(dataCachedRef.current.socials);
            }
        });
    }

    function validateFormData(FormData:FormDataType): boolean {
        const requiredFields = ["companyName", "companyEmail", "companyPhone", "companyAddress", "companyLogo", "companyPriceLimit"];
        for (const field of requiredFields) {
            if (field !== "companyPriceLimit") {
                if (field !== "companyLogo" && !FormData[field as keyof FormDataType]) {
                    alert(`El campo ${field} es obligatorio.`);
                    return false;
                }
            }

            if (field === "companyPriceLimit" && (FormData.companyPriceLimit === "" || isNaN(Number(FormData.companyPriceLimit)))) {
                alert(`El campo ${field} es obligatorio y debe ser un número válido.`);
                return false;
            }

            if (field === "companyLogo" && FormData.companyLogo instanceof File && FormData.companyLogo.size === 0) {
                alert(`El imagen de logo es obligatoria.`);
                return false;
            }
        }

        for (const social in FormDataSocials) {
            if (FormDataSocials[social as RedSocial] === "" && !/^https?:\/\/.+\..+/.test(FormDataSocials[social as RedSocial])) {
                alert(`La URL de las redes sociales debe ser válida o no estar vacía.`);
                return false;
            }
        }

        return true;
    }

    function handleSaveConfig() {

        SwalAlert.fire({
            title: "Guardar configuración",
            text: "Esta seguro que desea guardar la configuración esta configuración se aplicará a toda la plataforma",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, guardar",
            cancelButtonText: "No, cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!validateFormData(FormData)) {
                    return;
                }
        
                try {
                    const response = await configDataCompany({
                        ...FormData,
                        socials: FormDataSocials
                    });
                    alert(response.message);
                }catch (error) {
                    console.error("Error al guardar la configuración:", error);
                }
            } 
        });

    }

    function handleLogoChange(files: File[]) {
        if (files.length > 0) {
            setFormData(prev => ({ ...prev, companyLogo: files[0] }));
        }
    }

    const redesSociales: RedSocialItems[] = [
        {
            name: "Instagram",
            placeholder: "www.instagram.com/...",
            inputName: "instagram",
            colorTheme: "#e1306c",
            inputId: "instagram"
        },
        {
            name: "Facebook",
            placeholder: "www.facebook.com/...",
            inputName: "facebook",
            colorTheme: "#3b82f6",
            inputId: "facebook"
        },
        {
            name: "Twitter",
            placeholder: "www.twitter.com/...",
            inputName: "twitter",
            colorTheme: "#1da1f2",
            inputId: "twitter"
        }
    ];

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div className="max-w-2xl">
                    <h1 className="text-2xl font-bold mb-4">Configurar datos de la empresa</h1>
                    <p className="text-gray-600 mb-6">Aquí puedes configurar los datos de tu empresa, como el nombre, dirección, número de teléfono, correo electrónico y otros detalles relevantes.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleDiscard} className="py-2 px-6 bg-gray-200 rounded-full hover:bg-gray-300">Descartar</button>
                    <button onClick={handleSaveConfig} className="py-2 px-6 bg-blue-500 rounded-full text-white hover:bg-blue-600">Guardar cambios</button>
                </div>
            </div>
            <FormInfoCompany 
                handleLogoChange={handleLogoChange}
                FormData={FormData}
                handleInputChange={handleInputChange}
            />
            <RedComunityCards formDataSocials={FormDataSocials} handleRedesSocialesChange={handleRedesSocialesChange} redSocials={redesSociales} />
        </>
    )
}