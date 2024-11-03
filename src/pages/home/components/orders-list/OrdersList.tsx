import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../../../api/orders";
import OrderButton from "../order-button/OrderButton";
import { useState } from "react";
import "./OrdersList.css";
import { ORDER_STATUSES } from "./constants/order-statuses.constant";
import { formatDate } from "../../../../utils/format-date";
import { RECIPES } from "../../../recipes/constants/recipes";

const OrdersList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusId, setStatusId] = useState(null);
  const {
    data: ordersPagination,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["orders", page, limit, statusId],
    queryFn: () => getOrders(page, limit, statusId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="orders-container">
      <h1>Jornada de Donación de Platos</h1>

      <OrderButton></OrderButton>

      <div className="orders-table-header">
        <h2>Órdenes</h2>
        <button className="reload-button" onClick={() => refetch()}>
          Recargar
        </button>
      </div>
      <table className="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Plato</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {ordersPagination.data &&
            ordersPagination.data.map(
              (order: {
                id: number;
                recipeName: keyof typeof RECIPES;
                statusId: keyof typeof ORDER_STATUSES;
                createdAt: string;
              }) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{RECIPES[order.recipeName]}</td>
                  <td>{ORDER_STATUSES[order.statusId]}</td>
                  <td>{formatDate(order.createdAt)}</td>
                </tr>
              )
            )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersList;
