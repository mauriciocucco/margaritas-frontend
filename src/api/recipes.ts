export const getRecipes = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/kitchen/recipes`
  );

  if (!response.ok) {
    throw new Error("An error occurred while getting recipes");
  }

  const data = await response.json();

  console.log("Recipes: ", data);

  return data;
};
