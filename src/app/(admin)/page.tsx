import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import NewEntrysTable from "@/components/ecommerce/NewEntrysTable";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div>
      <div>
        <EcommerceMetrics />
        {/* <MonthlySalesChart /> */}
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
