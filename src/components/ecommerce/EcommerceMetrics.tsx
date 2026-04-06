import { BellIcon, BoxIcon, BoxIconLine, ChatIcon, DocsIcon, GroupIcon, InfoIcon, MailIcon, TaskIcon } from "@/icons";
import EcommerceMetricsItems from "./EcommerceMetricsItems";
import { getCardsTotalRegisters } from "@/services/dashboardServices";

export const EcommerceMetrics = async () => {

  const data = await getCardsTotalRegisters();

  const iconsMap: Record<namesCardsTotalRegisters, { icon: React.ReactNode, url: string }> = {
    "Productos": { icon: <BoxIcon className="text-gray-800 size-6 dark:text-white/90" />, url: "/products" },
    "Usuarios": { icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />, url: "/users" },
    "Ordenes": { icon: <ChatIcon className="text-gray-800 size-6 dark:text-white/90" />, url: "/orders" },
    "Marcas": { icon: <InfoIcon className="text-gray-800 size-6 dark:text-white/90" />, url: "/brands" },
    "Categorias": { icon: <DocsIcon className="text-gray-800 size-6 dark:text-white/90" />, url: "/categories" },
    "Metodos de Pago": { icon: <TaskIcon className="text-gray-800 size-6 dark:text-white/90" />, url: "/payment-methods" },
    "Metodos de Envio": { icon: <MailIcon className="text-gray-800 size-6 dark:text-white/90" />, url: "/shipping-methods" },
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6">
      {
        data && data.map((item) => (
          <EcommerceMetricsItems
            key={item.nameCard}
            title={item.nameCard}
            value={item.count}
            icon={iconsMap[item.nameCard].icon}
            url={iconsMap[item.nameCard].url}
            trend="up"
          />
        ))
      }
 </div>
  );
};
