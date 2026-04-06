import Link from "next/link";

interface EcommerceMetricsItemsProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: "up" | "down";
  url: string;
}

export default function EcommerceMetricsItems({ title, value, icon, trend, url }: EcommerceMetricsItemsProps) {
  return (
    <Link href={url}>
        <div className="group hover:shadow-lg hover:bg-gray-100 transition-shadow duration-300 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 rounded-xl">
        <div className="group-hover:bg-gray-300 flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            {icon}
        </div>
        <div className="flex items-end justify-between mt-5">
            <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
                {title}
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {value}
            </h4>
            </div>
            {/* <Badge color={trend === "up" ? "success" : "error"}>
            {trend === "up" ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {trend === "up" ? "12.5%" : "9.05%"}
            </Badge> */}
        </div>
        </div>
    </Link>
  );
}