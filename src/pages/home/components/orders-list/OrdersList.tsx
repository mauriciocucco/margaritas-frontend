import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../../../api/orders";
import OrderButton from "../order-button/OrderButton";
import { useMemo, useState } from "react";
import "./OrdersList.css";
import { ORDER_STATUSES } from "./constants/order-statuses.constant";
import { formatDate } from "../../../../utils/format-date";
import { RECIPES } from "../../../recipes/constants/recipes";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

const OrdersList = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const {
    data: ordersPagination,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["orders", pageIndex],
    queryFn: () => getOrders(pageIndex + 1, pageSize, null),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const tableData = useMemo(
    () => ordersPagination?.data || [],
    [ordersPagination]
  );
  const columns = useMemo<
    ColumnDef<{
      recipeName: string;
      statusId: keyof typeof ORDER_STATUSES;
      createdAt: string;
      id: number;
    }>[]
  >(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorFn: (row: { recipeName: string }) =>
          RECIPES[row.recipeName as keyof typeof RECIPES],
        id: "recipeName",
        header: "Plato",
      },
      {
        accessorFn: (row: { statusId: keyof typeof ORDER_STATUSES }) =>
          ORDER_STATUSES[row.statusId as keyof typeof ORDER_STATUSES],
        id: "statusId",
        header: "Estado",
      },
      {
        accessorFn: (row: { createdAt: string }) => formatDate(row.createdAt),
        id: "createdAt",
        header: "Fecha",
      },
    ],
    []
  );
  const table = useReactTable({
    columns,
    data: tableData,
    pageCount: ordersPagination?.totalPages || -1,
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
    <div className="orders-container">
      <h1>Jornada de Donación de Platos</h1>

      <OrderButton></OrderButton>

      <div className="orders-table-header">
        <h2>Órdenes</h2>
        <button className="reload-button" onClick={() => refetch()}>
          Recargar
        </button>
      </div>
      {ordersPagination.data?.length > 0 ? (
        <>
          <table className="orders-table">
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

export default OrdersList;
