import { v3 as uuidv3 } from "uuid";

const NAMESPACE = "margaritas";

export const createMassOrders = async (count: number) => {
  const orderPromises = [];

  for (const i of Array(count).keys()) {
    const customerId = uuidv3(`anonymous-${i}`, NAMESPACE);
    orderPromises.push(
      fetch("/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId }),
      })
    );
  }

  const responses = await Promise.all(orderPromises);

  return await Promise.all(
    responses.map((response) => {
      if (!response.ok) {
        throw new Error("An error ocurred during massive orders creation");
      }
      return response.json();
    })
  );
};
