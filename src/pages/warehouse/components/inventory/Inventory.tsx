import { useQuery } from "@tanstack/react-query";
import { getInventory } from "../../../../api/warehouse";
import { INGREDIENTS } from "./constants/ingredients";

const Inventory = () => {
  const {
    data: ingredients,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["ingredients"],
    queryFn: getInventory,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="table-wrapper">
      <div className="warehouse-table-header">
        <h2>Inventario</h2>
        <button className="reload-button" onClick={() => refetch()}>
          Recargar
        </button>
      </div>
      <table className="warehouse-table">
        <thead>
          <tr>
            <th>Ingrediente</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {ingredients &&
            ingredients.map(
              (ingredient: { id: number; name: string; quantity: number }) => (
                <tr key={ingredient.id}>
                  <td>
                    {INGREDIENTS[ingredient.name as keyof typeof INGREDIENTS]}
                  </td>
                  <td>{ingredient.quantity}</td>
                </tr>
              )
            )}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
