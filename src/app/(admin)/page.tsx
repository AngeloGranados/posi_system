import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import NewEntrysTable from "@/components/ecommerce/NewEntrysTable";
import ConfigsDashboard from "@/components/common/ConfigsDashboard";

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
        <ConfigsDashboard />
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
