import { useQuery } from "@tanstack/react-query";
import { getPurchaseHistory } from "../../../../api/warehouse";
import { formatDate } from "../../../../utils/format-date";
import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { INGREDIENTS } from "../inventory/constants/ingredients";
import "./PurchaseHistory.css";
import RefreshIcon from "../../../../assets/icons/refresh/RefreshIcon";

const PurchaseHistory = () => {
  const [ingredient, setIngredient] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const {
    data: purchaseHistory,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["purchaseHistory", pageIndex, ingredient],
    queryFn: () => getPurchaseHistory(pageIndex + 1, pageSize, ingredient),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const tableData = useMemo(
    () => purchaseHistory?.data || [],
    [purchaseHistory]
  );
  const columns = useMemo<
    ColumnDef<{ ingredient: string; quantity: number; date: string }>[]
  >(
    () => [
      {
        accessorFn: (history: { ingredient: keyof typeof INGREDIENTS }) =>
          INGREDIENTS[history.ingredient],
        id: "ingredient",
        header: "Ingrediente",
      },
      {
        accessorFn: (history: { quantity: number }) => history.quantity,
        id: "quantity",
        header: "Cantidad",
      },
      {
        accessorFn: (history: { date: string }) => formatDate(history.date),
        id: "date",
        header: "Fecha de compra",
      },
    ],
    []
  );
  const table = useReactTable({
    columns,
    data: tableData,
    pageCount: purchaseHistory?.totalPages || -1,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater(table.getState().pagination)
          : updater;
      setPageIndex(newState.pageIndex);
    },
  });

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="table-wrapper purchase-table-wrapper">
      <div className="warehouse-table-header">
        <h2>Historial de compras</h2>
        <button className="reload-button" onClick={() => refetch()}>
          Recargar
          <RefreshIcon />
        </button>
      </div>

      <div className="filter-container">
        <label htmlFor="ingredient-filter">Filtrar por ingrediente:</label>
        <select
          id="ingredient-filter"
          value={ingredient || "Todos"}
          onChange={(e) => {
            const value = e.target.value;
            setIngredient(value === "Todos" ? null : value);
            setPageIndex(0); // Reinicia la página al cambiar el filtro
          }}
        >
          <option value="Todos">Todos</option>
          {Object.keys(INGREDIENTS).map((key) => (
            <option key={key} value={key}>
              {INGREDIENTS[key as keyof typeof INGREDIENTS]}
            </option>
          ))}
        </select>
      </div>

      {purchaseHistory.data?.length > 0 ? (
        <>
          <table className="warehouse-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </button>
            <span>
              Página{" "}
              <strong>
                {table.getState().pagination.pageIndex + 1} de{" "}
                {table.getPageCount()}
              </strong>
            </span>
          </div>
        </>
      ) : (
        <div className="no-data-message">No hay datos disponibles</div>
      )}
    </div>
  );
};

export default PurchaseHistory;
