export const getInventory = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/warehouse/inventory`
  );

  if (!response.ok) {
    throw new Error("An error occurred while getting inventory");
  }

  const data = await response.json();

  console.log("Inventory: ", data);

  return data;
};

export const getPurchaseHistory = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/warehouse/purchase-history`
  );

  if (!response.ok) {
    throw new Error("An error occurred while getting purchase-history");
  }

  const data = await response.json();

  console.log("Purchase History: ", data);

  return data;
};