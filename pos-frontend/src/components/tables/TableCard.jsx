import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarName, getBgColor } from "../../utils"
import { useDispatch } from "react-redux";
import { updateTable } from "../../redux/slices/customerSlice";
import { updateTable as updateTableAPI } from "../../https";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

const TableCard = ({id, name, status, initials, seats, currentOrder, requiredSeats = 0}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const updateTableMutation = useMutation({
    mutationFn: ({ tableId, status }) => updateTableAPI({ tableId, status, orderId: null }),
    onSuccess: () => {
      enqueueSnackbar("Table status updated!", { variant: "success" });
      queryClient.invalidateQueries(["tables"]);
      setShowStatusMenu(false);
    },
    onError: () => {
      enqueueSnackbar("Failed to update table status!", { variant: "error" });
    },
  });

  const isBooked = status?.toLowerCase() === "booked";
  const hasActiveOrder = currentOrder !== null && currentOrder !== undefined;
  const canManuallyFree = isBooked && !hasActiveOrder; // Can only manually free if booked but no active order
  
  // Capacity validation
  const hasInsufficientCapacity = requiredSeats > 0 && seats < requiredSeats;
  const hasSufficientCapacity = requiredSeats > 0 && seats >= requiredSeats && !isBooked;
  const isDisabled = isBooked || hasInsufficientCapacity;

  const handleClick = (name) => {
    if(isDisabled) {
      if (hasInsufficientCapacity) {
        enqueueSnackbar(`This table only has ${seats} seats. You need ${requiredSeats} seats.`, { variant: "warning" });
      }
      return;
    }

    const table = { tableId: id, tableNo: name }
    dispatch(updateTable({table}))
    navigate(`/menu`);
  };

  const handleStatusChange = (e) => {
    e.stopPropagation();
    const newStatus = e.target.value;
    if (newStatus && newStatus !== status) {
      updateTableMutation.mutate({ tableId: id, status: newStatus });
    }
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    if (canManuallyFree) {
      setShowStatusMenu(!showStatusMenu);
    }
  };

  return (
    <div 
      onClick={() => handleClick(name)} 
      onContextMenu={handleRightClick}
      key={id} 
      className={`w-full max-w-[300px] mx-auto p-4 rounded-lg relative transition-all ${
        hasInsufficientCapacity 
          ? "bg-[#3d2626] border-2 border-red-500 cursor-not-allowed opacity-60" 
          : hasSufficientCapacity
          ? "bg-[#2e4a2e] border-2 border-green-500 hover:bg-[#3a5a3a] cursor-pointer"
          : isBooked
          ? "bg-[#262626] cursor-not-allowed"
          : "bg-[#262626] hover:bg-[#2c2c2c] cursor-pointer"
      }`}
    >
      <div className="flex items-center justify-between px-1">
        <h1 className="text-[#f5f5f5] text-xl font-semibold">Table <FaLongArrowAltRight className="text-[#ababab] ml-2 inline" /> {name}</h1>
        <p className={`${isBooked ? "text-green-600 bg-[#2e4a40]" : "bg-[#664a04] text-white"} px-2 py-1 rounded-lg capitalize`}>
          {status}
        </p>
      </div>
      <div className="flex items-center justify-center mt-5 mb-8">
        <h1 className={`text-white rounded-full p-5 text-xl`} style={{backgroundColor : initials ? getBgColor() : "#1f1f1f"}} >{getAvatarName(initials) || "N/A"}</h1>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[#ababab] text-xs">Seats: <span className="text-[#f5f5f5]">{seats}</span></p>
        {requiredSeats > 0 && (
          <p className={`text-xs font-semibold ${
            hasInsufficientCapacity ? "text-red-400" : hasSufficientCapacity ? "text-green-400" : "text-gray-400"
          }`}>
            {hasInsufficientCapacity ? "❌ Too small" : hasSufficientCapacity ? "✅ Fits party" : ""}
          </p>
        )}
      </div>
      
      {/* Insufficient Capacity Warning */}
      {hasInsufficientCapacity && (
        <div className="mt-3 p-2 bg-red-900 bg-opacity-30 rounded-lg border border-red-500">
          <p className="text-xs text-red-400 text-center font-semibold">
            ⚠️ Not enough seats ({seats}/{requiredSeats} needed)
          </p>
        </div>
      )}
      
      {/* Sufficient Capacity Indicator */}
      {hasSufficientCapacity && (
        <div className="mt-3 p-2 bg-green-900 bg-opacity-30 rounded-lg border border-green-500">
          <p className="text-xs text-green-400 text-center font-semibold">
            ✅ Perfect for your party!
          </p>
        </div>
      )}
      
      {/* Status Information */}
      {isBooked && hasActiveOrder && !hasInsufficientCapacity && (
        <div className="mt-3 p-2 bg-[#1f1f1f] rounded-lg border border-yellow-600">
          <p className="text-xs text-yellow-500 text-center">
            🔒 Table occupied - Will auto-free when order completes
          </p>
        </div>
      )}
      
      {/* Manual Status Change Option - Only for orphaned booked tables */}
      {canManuallyFree && (
        <div className="mt-3" onClick={(e) => e.stopPropagation()}>
          <select
            value={status}
            onChange={handleStatusChange}
            disabled={updateTableMutation.isPending}
            className="w-full bg-[#1f1f1f] text-white border border-gray-600 p-2 rounded-lg focus:outline-none focus:border-yellow-500 text-sm"
          >
            <option value="Booked">Keep Booked</option>
            <option value="Available">Set Available</option>
          </select>
          <p className="text-xs text-[#ababab] mt-1 text-center">⚠️ No active order - Manual override</p>
        </div>
      )}
    </div>
  );
};

export default TableCard;
