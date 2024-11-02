import { useMutation } from "@tanstack/react-query";
import { createMassOrders } from "../../../api/orders/orders";
import { useState } from "react";
import "./OrderButton.css";

const OrderButton = () => {
  const [orderCount, setOrderCount] = useState(0);

  const massOrderMutation = useMutation({
    mutationFn: createMassOrders,
    onSuccess: (data, variables) => {
      alert(`Successfully created ${variables} orders.`);
    },
    onError: (error) => {
      console.error("Error creating mass orders:", error);
      alert("Error creating mass orders.");
    },
  });

  const handleMassOrder = () => {
    massOrderMutation.mutate(orderCount);
  };

  return (
    <div>
      <input
        className="order-input"
        type="number"
        min={0}
        value={orderCount}
        onChange={(e) => setOrderCount(Number(e.target.value))}
        placeholder="Number of orders"
      />
      <button
        className="order-button"
        onClick={handleMassOrder}
        disabled={!orderCount}
      >
        Order
      </button>
    </div>
  );
};

export default OrderButton;
