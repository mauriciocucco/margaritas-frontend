import { useQuery } from "@tanstack/react-query";
import { getRecipes } from "../../api/recipes";
import { RECIPES } from "./constants/recipes";
import { INGREDIENTS } from "../warehouse/components/inventory/constants/ingredients";
import "./Recipes.css";

const Recipes = () => {
  const { data: recipes, isLoading } = useQuery({
    queryKey: ["recipes"],
    queryFn: getRecipes,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="recipes-container">
      <div className="table-wrapper">
        <div className="warehouse-table-header">
          <h1>Recetas</h1>
        </div>
        <table className="warehouse-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Ingredientes</th>
            </tr>
          </thead>
          <tbody>
            {recipes &&
              recipes.map(
                (recipe: {
                  id: number;
                  name: string;
                  ingredients: Record<string, string | number>;
                }) => (
                  <tr key={recipe.id}>
                    <td>{recipe.id}</td>
                    <td>{RECIPES[recipe.name as keyof typeof RECIPES]}</td>
                    <td>
                      <ul>
                        {Object.entries(recipe.ingredients).map(
                          ([ingredient, quantity]) => (
                            <li key={ingredient}>
                              {
                                INGREDIENTS[
                                  ingredient as keyof typeof INGREDIENTS
                                ]
                              }
                              : {quantity as string | number}
                            </li>
                          )
                        )}
                      </ul>
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Recipes;
