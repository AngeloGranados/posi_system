'use client';

import FormGroupInput from "@/components/form/group-input/FormGroupInput";
import FormRow from "@/components/form/group-input/FormRow";
import Label from "@/components/form/Label";
import FormInput from "@/components/form/input/InputField";
import DropzoneComponent from "@/components/form/form-elements/DropZone";

type CompanyData = {
    companyName: string;
    companyEmail: string;
    companyPhone: string;
    companyLogo: File;
    companyAddress: string;
    companyPriceLimit: string;
}
interface FormInfoCompanyData {
    FormData : CompanyData,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleLogoChange: (files: File[]) => void
}

export default function FormInfoCompany({FormData, handleInputChange, handleLogoChange}: FormInfoCompanyData) {


    return (
        <div className="flex">
            <form className="flex-1 bg-white p-6 rounded-lg shadow-md">
                <FormRow>
                    <FormGroupInput>
                        <Label className="text-gray-700" htmlFor="companyName">NOMBRE DE LA TIENDA</Label>
                        <FormInput 
                            id="companyName"
                            name="companyName"
                            placeholder="Ingresa el nombre de la tienda"
                            value={FormData.companyName}
                            onChange={handleInputChange}
                        />
                    </FormGroupInput>
                    <FormGroupInput>
                        <Label className="text-gray-700" htmlFor="companyEmail">EMAIL DE LA TIENDA</Label>
                        <FormInput 
                            id="companyEmail"
                            name="companyEmail"
                            placeholder="Ingresa el email de la tienda"
                            value={FormData.companyEmail}
                            onChange={handleInputChange}
                        />
                    </FormGroupInput>
                </FormRow>
                <FormRow>
                    <FormGroupInput>
                        <Label className="text-gray-700" htmlFor="companyAddress">DIRECCIÓN</Label>
                        <FormInput 
                            id="companyAddress"
                            name="companyAddress"
                            type="text"
                            placeholder="Ingresa la dirección de la tienda"
                            value={FormData.companyAddress}
                            onChange={handleInputChange}
                        />
                    </FormGroupInput>
                </FormRow>
                <FormRow>
                    <FormGroupInput>
                        <Label className="text-gray-700" htmlFor="companyPhone">TELEFONO</Label>
                        <FormInput 
                            id="companyPhone"
                            name="companyPhone"
                            type="tel"
                            value={FormData.companyPhone}
                            onChange={handleInputChange}
                            placeholder="Ingresa el telefono de la tienda"
                        />
                    </FormGroupInput>
                    <FormGroupInput>
                        <Label className="text-gray-700" htmlFor="companyPriceLimit">Precio Limite</Label>
                        <FormInput 
                            id="companyPriceLimit"
                            name="companyPriceLimit"
                            type="text"
                            placeholder="Ingresa el precio limite de la tienda"
                            value={FormData.companyPriceLimit}
                            onChange={handleInputChange}
                        />
                    </FormGroupInput>
                </FormRow>
            </form>
            <div className="flex-1 ml-6">
                <DropzoneComponent 
                    ImageDefault={FormData.companyLogo}
                    image={FormData.companyLogo}
                    onDrop={handleLogoChange}
                />
            </div>
        </div>
    )
}