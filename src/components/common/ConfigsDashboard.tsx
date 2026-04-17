import EditIcon from "../../../public/images/icons/edit-icon";
import ConfigItemCard from "./ConfigItemCard";

const configItems = [
    {
        title: "Personalizar Bentos",
        icon: <EditIcon width={20} height={20} fill="red" />,
        url: "/bentos"
    },
    {
        title: "Configurar datos de la empresa",
        icon: <EditIcon width={20} height={20} fill="red" />,
        url: "/empresa-config"
    }
]

export default function ConfigsDashboard() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-6 mb-6 mt-6">
        {configItems.map((item, index) => (
            <ConfigItemCard key={index} title={item.title} icon={item.icon} url={item.url} />
        ))}
    </div>
  );
}