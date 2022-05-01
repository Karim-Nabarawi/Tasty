import { defaultRecipe, recipeModel } from "./models";

const link =
  process.env.NODE_ENV === "development" ? "http://localhost:5000" : "https://cooking-recipes-tasty.herokuapp.com";

export const getRecipes = async () => {
  try {
    const data = await fetch(`${link}/getRecipes`);
    let json = await data.json();
    return json;
  } catch (e) {
    console.log("error", e);
    return e;
  }
};

export const getRecipeDetails = async (id?: string): Promise<recipeModel> => {
  try {
    const data = await fetch(`${link}/recipe/${id}`);
    let json = await data.json();
    return json;
  } catch (e) {
    console.log("error", e);
  }
  return defaultRecipe;
};

export const deleteRecipe = async (id?: string) => {
  try {
    const data = await fetch(`${link}/recipe/${id}`, {
      method: "DELETE",
    });
    console.log("deleted", data);
  } catch (e) {
    console.log("error", e);
  }
};

export const updateRecipe = async (formData: FormData, id?: string) => {
  try {
    await fetch(`${link}/recipe/${id}`, {
      method: "PATCH",
      body: formData,
    });
  } catch (e) {
    console.log("error", e);
  }
};

export const saveRecipe = async (formData: FormData) => {
  try {
    await fetch(`${link}/recipe`, {
      method: "POST",
      body: formData,
    });
  } catch (e) {
    console.log("error", e);
  }
};
