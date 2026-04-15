import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import NewEntrysTable from "@/components/ecommerce/NewEntrysTable";
import { ArrowRightIcon, BoxIcon, CopyIcon, DocsIcon, GridIcon } from "@/icons";
import GridShape from "@/components/common/GridShape";
import EditIcon from "../../../public/images/icons/edit-icon";
import Link from "next/link";

export const metadata: Metadata = {
  title: "POSI System - Ecommerce Dashboard",
  description: "Ecommerce Dashboard page for POSI System",
};

export default function Ecommerce() {
  
  return (
    <div>
      <div>
        <EcommerceMetrics />
        {/* <MonthlySalesChart /> */}
        <Link href="/bentos" className="grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-6 mb-6 mt-6">
          <div className="border border-gray-300 dark:bg-gray-700 rounded-2xl p-10 mb-6 hover:bg-gray-100 dark:hover:bg-gray-600 transition-bg cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mb-4">
              <EditIcon width={20} height={20} fill="red" />
            </div>
            <h2 className="text-gray-800 text-[1.5rem] font-[600] mb-2">Personalizar Bentos</h2>
            <span className="flex items-center gap-2 text-red-500 font-[700]">Abrir Editor <ArrowRightIcon /></span>
          </div>
        </Link>
        <NewEntrysTable />
      </div>

      {/* <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-12">
        <RecentOrders />
      </div> */}
    </div>
  );
}
