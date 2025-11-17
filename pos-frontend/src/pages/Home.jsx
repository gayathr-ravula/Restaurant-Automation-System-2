import React, { useEffect, useMemo } from "react";
import BottomNav from "../components/shared/BottomNav";
import Greetings from "../components/home/Greetings";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import MiniCard from "../components/home/MiniCard";
import RecentOrders from "../components/home/RecentOrders";
import PopularDishes from "../components/home/PopularDishes";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getOrders } from "../https";

const Home = () => {

    useEffect(() => {
      document.title = "POS | Home"
    }, [])

    // Fetch orders to calculate stats
    const { data: ordersData } = useQuery({
      queryKey: ["orders"],
      queryFn: async () => {
        return await getOrders();
      },
      placeholderData: keepPreviousData,
    });

    // Calculate stats from actual order data
    const stats = useMemo(() => {
      const orders = ordersData?.data?.data || [];
      
      // Total earnings from completed orders
      const totalEarnings = orders
        .filter(order => order.orderStatus === "Completed")
        .reduce((sum, order) => sum + (order.bills?.totalWithTax || 0), 0);
      
      // Count of in-progress orders
      const inProgressCount = orders.filter(
        order => order.orderStatus === "In Progress"
      ).length;

      return { totalEarnings, inProgressCount };
    }, [ordersData]);

  return (
    <section className="bg-[#1f1f1f] min-h-[calc(100vh-5rem)] pb-20 overflow-y-auto">
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-6 px-3 lg:px-0">
        {/* Left Div */}
        <div className="flex-[3] w-full">
          <Greetings />
          <div className="flex flex-col sm:flex-row items-center w-full gap-3 px-4 sm:px-8 mt-8">
            <MiniCard 
              title="Total Earnings" 
              icon={<BsCashCoin />} 
              number={Math.round(stats.totalEarnings)} 
              footerNum={0} 
            />
            <MiniCard 
              title="In Progress" 
              icon={<GrInProgress />} 
              number={stats.inProgressCount} 
              footerNum={0} 
            />
          </div>
          <RecentOrders />
        </div>
        {/* Right Div */}
        <div className="flex-[2] w-full">
          <PopularDishes />
        </div>
      </div>
      <BottomNav />
    </section>
  );
};

export default Home;
