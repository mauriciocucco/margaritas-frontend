import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrders } from "../../../../api/orders";
import OrderButton from "../order-button/OrderButton";
import { useEffect, useMemo, useRef, useState } from "react";
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
import RefreshIcon from "../../../../assets/icons/refresh/RefreshIcon";

const OrdersList = () => {
  const [statusId, setStatusId] = useState<number | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const [pollingInterval, setPollingInterval] = useState<number | false>(false);
  const {
    data: ordersPagination,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["orders", pageIndex, statusId],
    queryFn: () => getOrders(pageIndex + 1, pageSize, statusId),
    staleTime: 500,
    refetchOnWindowFocus: false,
    refetchInterval: pollingInterval,
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
        accessorKey: "statusId",
        header: "Estado",
        cell: ({ row }) => {
          const statusId = row.original.statusId;
          const statusName = ORDER_STATUSES[statusId];
          const statusClass = `status-${statusId}`;

          return <span className={statusClass}>{statusName}</span>;
        },
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
  const queryClient = useQueryClient();
  const startTimeRef = useRef<number | null>(null);

  const handleOrderPlaced = () => {
    setPollingInterval(1000);
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  };

  useEffect(() => {
    const now = Date.now();
    if (startTimeRef.current === null) {
      startTimeRef.current = now;
    }

    const elapsedTime = now - startTimeRef.current;

    if (ordersPagination?.data) {
      const allStatusId3Or5 = ordersPagination.data.every(
        (order: { statusId: number }) =>
          order.statusId === 3 || order.statusId === 5
      );

      if (allStatusId3Or5 || elapsedTime >= 3 * 60 * 1000) {
        setPollingInterval(false);
      }
    }
  }, [ordersPagination, queryClient]);

  if (isPending) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="orders-container">
      <h1>Jornada de Donación de Platos</h1>

      <OrderButton onOrderPlaced={handleOrderPlaced}></OrderButton>

      <div className="filter-container">
        <label htmlFor="status-filter">Filtrar por estado:</label>
        <select
          id="status-filter"
          value={statusId || "Todos"}
          onChange={(e) => {
            const value = e.target.value;
            setStatusId(value === "Todos" ? null : Number(value));
            setPageIndex(0);
          }}
        >
          <option value="Todos">Todos</option>
          {Object.entries(ORDER_STATUSES).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="orders-table-header">
        <h2>Órdenes</h2>
        <button className="reload-button" onClick={() => refetch()}>
          Recargar
          <RefreshIcon />
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
