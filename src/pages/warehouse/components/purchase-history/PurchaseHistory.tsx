import { useQuery } from "@tanstack/react-query";
import { getPurchaseHistory } from "../../../../api/warehouse";
import { formatDate } from "../../../../utils/format-date";

const PurchaseHistory = () => {
  const {
    data: purchaseHistory,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["purchaseHistory"],
    queryFn: () => getPurchaseHistory(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="table-wrapper">
      <div className="warehouse-table-header">
        <h2>Historial de compras</h2>
        <button className="reload-button" onClick={() => refetch()}>
          Recargar
        </button>
      </div>
      <table className="warehouse-table">
        <thead>
          <tr>
            <th>Ingrediente</th>
            <th>Cantidad</th>
            <th>Fecha de compra</th>
          </tr>
        </thead>
        <tbody>
          {purchaseHistory && purchaseHistory.length > 0 ? (
            purchaseHistory.map(
              (history: {
                ingredient: string;
                quantity: number;
                date: string;
              }) => (
                <tr key={history.ingredient}>
                  <td>{history.ingredient}</td>
                  <td>{history.quantity}</td>
                  <td>{formatDate(history.date)}</td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td colSpan={3}>No hay datos disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseHistory;
