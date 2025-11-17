import React, { useState } from "react";
import { FaCheckDouble, FaLongArrowAltRight, FaTrash, FaEdit } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { formatDateAndTime, getAvatarName } from "../../utils/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOrder, updateOrderStatus } from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";

const OrderCard = ({ key, order }) => {
  console.log(order);
  const queryClient = useQueryClient();
  const userData = useSelector((state) => state.user);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Delete order mutation
  const deleteOrderMutation = useMutation({
    mutationFn: (orderId) => deleteOrder(orderId),
    onSuccess: () => {
      enqueueSnackbar("Order deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["tables"]); // Refresh tables when order is deleted
      setShowDeleteConfirm(false);
    },
    onError: () => {
      enqueueSnackbar("Failed to delete order!", { variant: "error" });
    }
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, orderStatus }) => updateOrderStatus({ orderId, orderStatus }),
    onSuccess: () => {
      enqueueSnackbar("Order status updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["tables"]); // Refresh tables when order status changes
    },
    onError: () => {
      enqueueSnackbar("Failed to update order status!", { variant: "error" });
    }
  });

  const handleDelete = () => {
    deleteOrderMutation.mutate(order._id);
  };

  const handleStatusChange = (newStatus) => {
    updateStatusMutation.mutate({ orderId: order._id, orderStatus: newStatus });
  };

  return (
    <div key={key} className="w-full max-w-[500px] mx-auto bg-[#262626] p-4 rounded-lg">
      <div className="flex items-center gap-5">
        <button className="bg-[#f6b100] p-3 text-xl font-bold rounded-lg">
          {getAvatarName(order.customerDetails.name)}
        </button>
        <div className="flex items-center justify-between w-[100%]">
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
              {order.customerDetails.name}
            </h1>
            <p className="text-[#ababab] text-sm">#{Math.floor(new Date(order.orderDate).getTime())} / Dine in</p>
            <p className="text-[#ababab] text-sm">Table <FaLongArrowAltRight className="text-[#ababab] ml-2 inline" /> {order.table.tableNo}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {order.orderStatus === "Ready" ? (
              <>
                <p className="text-green-600 bg-[#2e4a40] px-2 py-1 rounded-lg">
                  <FaCheckDouble className="inline mr-2" /> {order.orderStatus}
                </p>
                <p className="text-[#ababab] text-sm">
                  <FaCircle className="inline mr-2 text-green-600" /> Ready to
                  serve
                </p>
              </>
            ) : (
              <>
                <p className="text-yellow-600 bg-[#4a452e] px-2 py-1 rounded-lg">
                  <FaCircle className="inline mr-2" /> {order.orderStatus}
                </p>
                <p className="text-[#ababab] text-sm">
                  <FaCircle className="inline mr-2 text-yellow-600" /> Preparing your order
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 text-[#ababab]">
        <p>{formatDateAndTime(order.orderDate)}</p>
        <p>{order.items.length} Items</p>
      </div>
      <hr className="w-full mt-4 border-t-1 border-gray-500" />
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-[#f5f5f5] text-lg font-semibold">Total</h1>
        <p className="text-[#f5f5f5] text-lg font-semibold">₹{order.bills.totalWithTax.toFixed(2)}</p>
      </div>
      
      {/* Action Buttons */}
      {order.orderStatus === "Completed" ? (
        <div className="mt-4">
          <div className="p-3 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-500">
            <p className="text-blue-400 text-center font-semibold">
              ✓ Order Completed (Locked)
            </p>
            <p className="text-xs text-gray-400 text-center mt-1">
              This order cannot be modified
            </p>
          </div>
          
          {/* Admin-only delete button for completed orders */}
          {userData.role === "Admin" && (
            <div className="mt-3">
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  title="Admin: Delete Completed Order"
                >
                  <FaTrash /> Delete Completed Order (Admin)
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    disabled={deleteOrderMutation.isPending}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 font-semibold"
                  >
                    {deleteOrderMutation.isPending ? "Deleting..." : "Confirm Delete"}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3 mt-4">
          <select
            className="flex-1 bg-[#1a1a1a] text-[#f5f5f5] border border-gray-500 p-2 rounded-lg focus:outline-none focus:border-[#f6b100]"
            value={order.orderStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updateStatusMutation.isPending}
          >
            <option value="In Progress">In Progress</option>
            <option value="Ready">Ready</option>
            <option value="Completed">Completed</option>
          </select>
          
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
              title="Delete Order"
            >
              <FaTrash />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={deleteOrderMutation.isPending}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {deleteOrderMutation.isPending ? "Deleting..." : "Confirm"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
