import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import OrderCard from "../components/orders/OrderCard";
import BackButton from "../components/shared/BackButton";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../https/index";
import { enqueueSnackbar } from "notistack"

const Orders = () => {

  const [status, setStatus] = useState("all");

    useEffect(() => {
      document.title = "POS | Orders"
    }, [])

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData
  })

  if(isError) {
    enqueueSnackbar("Something went wrong!", {variant: "error"})
  }

  // Filter orders based on status
  const filteredOrders = resData?.data.data.filter((order) => {
    if (status === "all") return true;
    if (status === "progress") return order.orderStatus === "In Progress";
    if (status === "ready") return order.orderStatus === "Ready";
    if (status === "completed") return order.orderStatus === "Completed";
    return true;
  }) || [];

  return (
    <section className="bg-[#1f1f1f] min-h-[calc(100vh-5rem)] pb-20">
      <div className="sticky top-0 bg-[#1f1f1f] z-10 border-b border-gray-700">
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 md:px-10 py-4 gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <BackButton />
            <h1 className="text-[#f5f5f5] text-xl sm:text-2xl font-bold tracking-wider">
              Orders
            </h1>
          </div>
          <div className="flex flex-wrap items-center justify-around gap-2 sm:gap-4">
            <button 
              onClick={() => setStatus("all")} 
              className={`text-[#ababab] text-sm sm:text-lg ${status === "all" && "bg-[#383838]"} rounded-lg px-3 sm:px-5 py-1 sm:py-2 font-semibold transition-colors`}
            >
              All
            </button>
            <button 
              onClick={() => setStatus("progress")} 
              className={`text-[#ababab] text-sm sm:text-lg ${status === "progress" && "bg-[#383838]"} rounded-lg px-3 sm:px-5 py-1 sm:py-2 font-semibold transition-colors`}
            >
              In Progress
            </button>
            <button 
              onClick={() => setStatus("ready")} 
              className={`text-[#ababab] text-sm sm:text-lg ${status === "ready" && "bg-[#383838]"} rounded-lg px-3 sm:px-5 py-1 sm:py-2 font-semibold transition-colors`}
            >
              Ready
            </button>
            <button 
              onClick={() => setStatus("completed")} 
              className={`text-[#ababab] text-sm sm:text-lg ${status === "completed" && "bg-[#383838]"} rounded-lg px-3 sm:px-5 py-1 sm:py-2 font-semibold transition-colors`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-4 sm:px-8 md:px-16 py-6 overflow-y-auto">
        {
          filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              return <OrderCard key={order._id} order={order} />
            })
          ) : <p className="col-span-3 text-gray-500">No orders available</p>
        }
      </div>

      <BottomNav />
    </section>
  );
};

export default Orders;
