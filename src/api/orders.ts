import { v4 as uuidv4 } from "uuid";

export const getOrders = async (
  page: number = 1,
  limit: number = 10,
  statusId: number | null = null
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (statusId) {
    params.append("statusId", statusId.toString());
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/orders?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("An error occurred while getting orders");
  }

  const data = await response.json();

  // console.log("orders pagination: ", data);

  return data;
};

export const createMassOrders = async (count: number) => {
  const orders: Array<{ customerId: string }> = [];
  const chunks = [];
  const responses = [];

  try {
    Array.from({ length: count }).forEach(() => {
      orders.push({
        customerId: uuidv4(),
      });
    });

    for (let i = 0; i < orders.length; i += 50) {
      chunks.push(orders.slice(i, i + 50));
    }

    for (const chunk of chunks) {
      const response = await fetch(import.meta.env.VITE_API_URL + "/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chunk),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      responses.push(await response.json());
    }

    console.log("mass orders created: ", responses);

    return responses;
  } catch (error) {
    console.error("An error ocurred during massive orders creation:", error);

    throw error;
  }
};
