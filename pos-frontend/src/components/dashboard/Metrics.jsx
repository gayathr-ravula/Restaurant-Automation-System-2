import React, { useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getOrders, getTables } from "../../https";

const Metrics = () => {
  // Fetch orders
  const { data: ordersData } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  // Fetch tables
  const { data: tablesData } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      return await getTables();
    },
    placeholderData: keepPreviousData,
  });

  // Calculate metrics from actual data
  const metricsData = useMemo(() => {
    const orders = ordersData?.data?.data || [];
    const tables = tablesData?.data?.data || [];

    // Calculate total revenue from completed orders
    const totalRevenue = orders
      .filter(order => order.orderStatus === "Completed")
      .reduce((sum, order) => sum + (order.bills?.totalWithTax || 0), 0);

    // Count total orders
    const totalOrders = orders.length;

    // Count unique customers (by phone number)
    const uniqueCustomers = new Set(
      orders.map(order => order.customerDetails?.phone).filter(Boolean)
    ).size;

    // Count tables by status
    const availableTables = tables.filter(table => table.status?.toLowerCase() === "available").length;
    const bookedTables = tables.filter(table => table.status?.toLowerCase() === "booked").length;

    return [
      { 
        title: "Total Revenue", 
        value: `₹${totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, 
        percentage: "Completed Orders", 
        color: "#025cca", 
        isIncrease: true 
      },
      { 
        title: "Total Orders", 
        value: totalOrders.toString(), 
        percentage: `${orders.filter(o => o.orderStatus === "Completed").length} Completed`, 
        color: "#02ca3a", 
        isIncrease: true 
      },
      { 
        title: "Total Customers", 
        value: uniqueCustomers.toString(), 
        percentage: "Unique", 
        color: "#f6b100", 
        isIncrease: true 
      },
      { 
        title: "Available Tables", 
        value: availableTables.toString(), 
        percentage: `${bookedTables} Booked`, 
        color: "#8b5cf6", 
        isIncrease: availableTables > bookedTables 
      },
    ];
  }, [ordersData, tablesData]);

  // Calculate item-level details
  const itemsData = useMemo(() => {
    const orders = ordersData?.data?.data || [];

    // Count orders by status
    const inProgressCount = orders.filter(o => o.orderStatus === "In Progress").length;
    const readyCount = orders.filter(o => o.orderStatus === "Ready").length;
    const completedCount = orders.filter(o => o.orderStatus === "Completed").length;
    
    // Calculate total items sold
    const totalItemsSold = orders.reduce((sum, order) => {
      return sum + (order.items?.length || 0);
    }, 0);

    return [
      { 
        title: "In Progress", 
        value: inProgressCount.toString(), 
        percentage: "Orders", 
        color: "#f97316" 
      },
      { 
        title: "Ready", 
        value: readyCount.toString(), 
        percentage: "Orders", 
        color: "#10b981" 
      },
      { 
        title: "Completed", 
        value: completedCount.toString(), 
        percentage: "Orders", 
        color: "#3b82f6" 
      },
      { 
        title: "Total Items Sold", 
        value: totalItemsSold.toString(), 
        percentage: "All Orders", 
        color: "#ec4899" 
      },
    ];
  }, [ordersData]);

  return (
    <div className="container mx-auto py-2 px-6 md:px-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">
            Overall Performance
          </h2>
          <p className="text-sm text-[#ababab]">
            Real-time metrics and analytics for your restaurant operations
          </p>
        </div>
        <button className="flex items-center gap-1 px-4 py-2 rounded-md text-[#f5f5f5] bg-[#1a1a1a]">
          Last 1 Month
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="4"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {metricsData.map((metric, index) => {
          return (
            <div
              key={index}
              className="shadow-sm rounded-lg p-4"
              style={{ backgroundColor: metric.color }}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium text-xs text-[#f5f5f5]">
                  {metric.title}
                </p>
                <div className="flex items-center gap-1">
                  <p className="font-medium text-xs text-[#ababab]">
                    {metric.percentage}
                  </p>
                </div>
              </div>
              <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col justify-between mt-12">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">
            Order Status Breakdown
          </h2>
          <p className="text-sm text-[#ababab]">
            Track orders across different stages of fulfillment
          </p>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4">

            {
                itemsData.map((item, index) => {
                    return (
                        <div key={index} className="shadow-sm rounded-lg p-4" style={{ backgroundColor: item.color }}>
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-xs text-[#f5f5f5]">{item.title}</p>
                          <div className="flex items-center gap-1">
                            <p className="font-medium text-xs text-[#ababab]">{item.percentage}</p>
                          </div>
                        </div>
                        <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">{item.value}</p>
                      </div>
                    )
                })
            }

        </div>
      </div>
    </div>
  );
};

export default Metrics;
