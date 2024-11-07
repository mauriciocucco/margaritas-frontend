import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMassOrders } from "../../../../api/orders";
import { useState } from "react";
import "./OrderButton.css";

const OrderButton = ({ onOrderPlaced }) => {
  const [orderCount, setOrderCount] = useState(1);
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createMassOrders,
    onSuccess: (response) => {
      console.log(response);

      queryClient.invalidateQueries({ queryKey: ["orders"] });

      if (onOrderPlaced) {
        onOrderPlaced();
      }
    },
    onError: (error) => {
      console.error("Error creating mass orders:", error);

      alert("Error creating mass orders.");
    },
  });

  const handleMassOrder = () => {
    mutate(orderCount);
  };

  return (
    <div className="button-container">
      <input
        className="order-input"
        type="number"
        min={1}
        value={orderCount}
        onChange={(e) => setOrderCount(Number(e.target.value))}
        placeholder="Number of orders"
      />
      <button
        className="order-button"
        onClick={handleMassOrder}
        disabled={isPending}
      >
        Ordenar plato/s
      </button>
    </div>
  );
};

export default OrderButton;
