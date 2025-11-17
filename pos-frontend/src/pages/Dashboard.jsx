import React, { useState, useEffect } from "react";
import { MdTableBar, MdCategory } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import Metrics from "../components/dashboard/Metrics";
import RecentOrders from "../components/dashboard/RecentOrders";
import Modal from "../components/dashboard/Modal";
import AddCategoryModal from "../components/dashboard/AddCategoryModal";
import AddDishModal from "../components/dashboard/AddDishModal";

const buttons = [
  { label: "Add Table", icon: <MdTableBar />, action: "table" },
  { label: "Add Category", icon: <MdCategory />, action: "category" },
  { label: "Add Dishes", icon: <BiSolidDish />, action: "dishes" },
];

const tabs = ["Metrics", "Orders", "Payments"];

const Dashboard = () => {

  useEffect(() => {
    document.title = "POS | Admin Dashboard"
  }, [])

  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Metrics");

  const handleOpenModal = (action) => {
    if (action === "table") setIsTableModalOpen(true);
    if (action === "category") setIsCategoryModalOpen(true);
    if (action === "dishes") setIsDishModalOpen(true);
  };

  return (
    <div className="bg-[#1f1f1f] min-h-[calc(100vh-5rem)] pb-20 overflow-y-auto">
      <div className="container mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 py-6 md:py-10 lg:py-14 px-4 md:px-6">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {buttons.map(({ label, icon, action }) => {
            return (
              <button
                key={label}
                onClick={() => handleOpenModal(action)}
                className="bg-[#1a1a1a] hover:bg-[#262626] px-4 sm:px-6 md:px-8 py-2 md:py-3 rounded-lg text-[#f5f5f5] font-semibold text-sm md:text-md flex items-center gap-2 transition-colors"
              >
                {label} {icon}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {tabs.map((tab) => {
            return (
              <button
                key={tab}
                className={`
                px-4 sm:px-6 md:px-8 py-2 md:py-3 rounded-lg text-[#f5f5f5] font-semibold text-sm md:text-md flex items-center gap-2 transition-colors ${
                  activeTab === tab
                    ? "bg-[#262626]"
                    : "bg-[#1a1a1a] hover:bg-[#262626]"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "Metrics" && <Metrics />}
      {activeTab === "Orders" && <RecentOrders />}
      {activeTab === "Payments" && 
        <div className="text-white p-6 container mx-auto">
          Payment Component Coming Soon
        </div>
      }

      {isTableModalOpen && <Modal setIsTableModalOpen={setIsTableModalOpen} />}
      {isCategoryModalOpen && (
        <AddCategoryModal setIsCategoryModalOpen={setIsCategoryModalOpen} />
      )}
      {isDishModalOpen && (
        <AddDishModal setIsDishModalOpen={setIsDishModalOpen} />
      )}
    </div>
  );
};

export default Dashboard;
