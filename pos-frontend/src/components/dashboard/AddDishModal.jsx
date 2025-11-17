import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addMenuItem, getCategories } from "../../https";
import { enqueueSnackbar } from "notistack";

const AddDishModal = ({ setIsDishModalOpen }) => {
  const queryClient = useQueryClient();
  const [dishData, setDishData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    isAvailable: true,
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDishData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dishData.category) {
      enqueueSnackbar("Please select a category", { variant: "error" });
      return;
    }
    dishMutation.mutate(dishData);
  };

  const handleCloseModal = () => {
    setIsDishModalOpen(false);
  };

  const dishMutation = useMutation({
    mutationFn: (reqData) => addMenuItem(reqData),
    onSuccess: (res) => {
      setIsDishModalOpen(false);
      const { data } = res;
      enqueueSnackbar(data.message, { variant: "success" });
      queryClient.invalidateQueries(["menuItems"]);
    },
    onError: (error) => {
      const { data } = error.response;
      enqueueSnackbar(data.message || "Failed to add menu item", {
        variant: "error",
      });
      console.log(error);
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-[#262626] p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex justify-between item-center mb-4">
          <h2 className="text-[#f5f5f5] text-xl font-semibold">Add Dish</h2>
          <button
            onClick={handleCloseModal}
            className="text-[#f5f5f5] hover:text-red-500"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-10">
          <div>
            <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
              Dish Name
            </label>
            <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
              <input
                type="text"
                name="name"
                value={dishData.name}
                onChange={handleInputChange}
                className="bg-transparent flex-1 text-white focus:outline-none"
                required
                placeholder="e.g., Butter Chicken"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
              Price (₹)
            </label>
            <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
              <input
                type="number"
                name="price"
                value={dishData.price}
                onChange={handleInputChange}
                className="bg-transparent flex-1 text-white focus:outline-none"
                required
                min="0"
                step="0.01"
                placeholder="e.g., 250"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
              Category
            </label>
            <div className="rounded-lg bg-[#1f1f1f]">
              <select
                name="category"
                value={dishData.category}
                onChange={handleInputChange}
                className="w-full p-5 px-4 bg-transparent text-white focus:outline-none rounded-lg"
                required
              >
                <option value="" className="bg-[#1f1f1f]">
                  Select a category
                </option>
                {categoriesData?.data?.data?.map((category) => (
                  <option
                    key={category._id}
                    value={category._id}
                    className="bg-[#1f1f1f]"
                  >
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
              Description (Optional)
            </label>
            <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
              <textarea
                name="description"
                value={dishData.description}
                onChange={handleInputChange}
                className="bg-transparent flex-1 text-white focus:outline-none resize-none"
                rows="3"
                placeholder="Brief description of the dish"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isAvailable"
              checked={dishData.isAvailable}
              onChange={(e) =>
                setDishData((prev) => ({
                  ...prev,
                  isAvailable: e.target.checked,
                }))
              }
              className="w-5 h-5 cursor-pointer"
            />
            <label className="text-[#ababab] text-sm font-medium">
              Available for order
            </label>
          </div>

          <button
            type="submit"
            disabled={dishMutation.isPending}
            className="w-full rounded-lg mt-10 mb-6 py-3 text-lg bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50"
          >
            {dishMutation.isPending ? "Adding..." : "Add Dish"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddDishModal;
