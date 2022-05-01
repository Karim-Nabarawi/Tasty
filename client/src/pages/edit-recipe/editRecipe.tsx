import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getRecipeDetails, updateRecipe } from "../../api";
import ModifyRecipe from "../../components/recipe-modification/ModifyRecipe";

import editBackground from "../../img/editRecipe.jpg";
import { recipeModel } from "../../models";

type recipe = Omit<recipeModel, "image"> & {
  image: File;
};

const myRecipe: recipeModel = {
  title: "",
  time: "",
  ingredients: "",
  instructions: "",
  description: "",
  image: "",
};

const EditRecipe = () => {
  let params = useParams();
  let navigate = useNavigate();
  const [detailedRecipe, setDetailedRecipe] = useState<recipeModel>(myRecipe);

  const getRecipe = async () => {
    setDetailedRecipe(await getRecipeDetails(params.id));
  };

  useEffect(() => {
    getRecipe();
  }, []);

  const onEditSubmit = async (e: React.FormEvent<HTMLFormElement>, recipeData: recipe) => {
    e.preventDefault();

    let updatedRecipe: recipeModel = myRecipe;

    try {
      updatedRecipe.title = recipeData.title !== "" ? recipeData.title : detailedRecipe.title;
      updatedRecipe.time = recipeData.time !== "" ? recipeData.time : detailedRecipe.time;
      updatedRecipe.ingredients = recipeData.ingredients !== "" ? recipeData.ingredients : detailedRecipe.ingredients;
      updatedRecipe.instructions =
        recipeData.instructions !== "" ? recipeData.instructions : detailedRecipe.instructions;
      updatedRecipe.description = recipeData.description !== "" ? recipeData.description : detailedRecipe.description;
      if (recipeData.image.size === 0) {
        updatedRecipe.image = detailedRecipe.image;
      }

      const formData = new FormData();
      formData.append("image", recipeData.image);
      formData.append("data", JSON.stringify(updatedRecipe));
      await updateRecipe(formData, params.id);
      navigate("/");
    } catch (e) {
      console.log("error", e);
    }
  };
  return (
    <ModifyRecipe
      formTile="Edit Recipe"
      recipeData={detailedRecipe}
      backgroundImgUrl={editBackground}
      submitFunction={onEditSubmit}
    />
  );
};

export default EditRecipe;
