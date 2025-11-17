import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/tables/TableCard";
import { tables } from "../constants";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTables } from "../https";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";

const Tables = () => {
  const [status, setStatus] = useState("all");
  const customerData = useSelector((state) => state.customer);
  const guestCount = customerData.guests || 0;

    useEffect(() => {
      document.title = "POS | Tables"
    }, [])

  const { data: resData, isError } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      return await getTables();
    },
    placeholderData: keepPreviousData,
  });

  if(isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" })
  }

  console.log(resData);

  // Filter tables based on status
  const filteredTables = resData?.data.data.filter((table) => {
    if (status === "all") return true;
    if (status === "booked") return table.status?.toLowerCase() === "booked";
    return true;
  }) || [];

  return (
    <section className="bg-[#1f1f1f] min-h-[calc(100vh-5rem)] pb-20">
      <div className="sticky top-0 bg-[#1f1f1f] z-10 border-b border-gray-700">
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 md:px-10 py-4 gap-4">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <BackButton />
            <h1 className="text-[#f5f5f5] text-xl sm:text-2xl font-bold tracking-wider">
              Tables
            </h1>
            {guestCount > 0 && (
              <span className="bg-yellow-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-semibold text-sm sm:text-base">
                👥 {guestCount} Guests - Looking for {guestCount}+ seats
              </span>
            )}
          </div>
          <div className="flex items-center justify-around gap-2 sm:gap-4">
            <button
              onClick={() => setStatus("all")}
              className={`text-[#ababab] text-sm sm:text-lg ${
                status === "all" && "bg-[#383838]"
              } rounded-lg px-3 sm:px-5 py-1 sm:py-2 font-semibold transition-colors`}
            >
              All
            </button>
            <button
              onClick={() => setStatus("booked")}
              className={`text-[#ababab] text-sm sm:text-lg ${
                status === "booked" && "bg-[#383838]"
              } rounded-lg px-3 sm:px-5 py-1 sm:py-2 font-semibold transition-colors`}
            >
              Booked
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4 sm:px-8 md:px-16 py-6 overflow-y-auto">
        {filteredTables.map((table) => {
          return (
            <TableCard
              key={table._id}
              id={table._id}
              name={table.tableNo}
              status={table.status}
              initials={table?.currentOrder?.customerDetails.name}
              seats={table.seats}
              currentOrder={table.currentOrder}
              requiredSeats={guestCount}
            />
          );
        })}
      </div>

      <BottomNav />
    </section>
  );
};

export default Tables;
