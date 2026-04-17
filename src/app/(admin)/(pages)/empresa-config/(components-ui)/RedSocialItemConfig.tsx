import FormGroupInput from "@/components/form/group-input/FormGroupInput";
import FormRow from "@/components/form/group-input/FormRow";
import FormInput from "@/components/form/input/InputField";
import EditIcon from "../../../../../../public/images/icons/edit-icon";

interface RedSocialItemConfigProps {
    red : RedSocialItems
    formDataSocials: Record<RedSocial, string>;
    handleRedesSocialesChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function RedSocialItemConfig({ red : { name, placeholder, inputName, inputId, colorTheme }, handleRedesSocialesChange, formDataSocials }: RedSocialItemConfigProps) {

    const redIcon: Record<RedSocial, React.JSX.Element> = {
        Facebook: <EditIcon width={24} height={24} fill={colorTheme} />,
        Twitter: <EditIcon width={24} height={24} fill={colorTheme} />,
        Instagram: <EditIcon width={24} height={24} fill={colorTheme} />,
        LinkedIn: <EditIcon width={24} height={24} fill={colorTheme} />,
        YouTube: <EditIcon width={24} height={24} fill={colorTheme} />,
    }

    return (
        <div style={{ boxShadow: `-4px 0 0 ${colorTheme}` }} className={`bg-white p-6 rounded-lg mt-6`}>
            <div className="flex flex-col gap-4">
                <div className={`flex items-center gap-4 text-${colorTheme}-500 font-bold`}>
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        {redIcon[name]}
                    </div>
                    {name}
                </div>
                <div>
                    <FormRow>
                        <FormGroupInput>
                            <FormInput 
                                id={inputId}
                                name={inputName}
                                placeholder={placeholder}
                                onChange={handleRedesSocialesChange}
                                value={formDataSocials[inputName as RedSocial]}
                            />
                        </FormGroupInput>
                    </FormRow>
                </div>
            </div>
        </div>
    )
}