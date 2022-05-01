export type recipeModel = {
  _id?: string;
  title: string;
  time: string;
  ingredients: string;
  instructions: string;
  description: string;
  image: string;
};

export const defaultRecipe: recipeModel = {
  _id: "",
  title: "",
  time: "",
  ingredients: "",
  instructions: "",
  description: "",
  image: "",
};
