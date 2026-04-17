import RedSocialItemConfig from "./RedSocialItemConfig"

interface RedComunityCardsProps {
    redSocials: RedSocialItems[];
    formDataSocials: Record<RedSocial, string>;
    handleRedesSocialesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


export default function RedComunityCards({ redSocials, formDataSocials, handleRedesSocialesChange }: RedComunityCardsProps) {

    return (
        <div className="mt-10">
            <div>
                <h2 className="text-lg font-bold text-[1.5rem]">Redes Sociales</h2>
                <p className="text-gray-600">Aquí puedes configurar las redes sociales de tu empresa.</p>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
                {
                    redSocials.map((red, index) => (
                        <RedSocialItemConfig 
                            handleRedesSocialesChange={handleRedesSocialesChange} 
                            key={index} 
                            red={red} 
                            formDataSocials={formDataSocials} />
                    ))
                }
            </div>
        </div>
    )
}