import GradientButton from "../../components/utils/button/GradientButton";
import FileInput from "../../components/utils/input/FileInput";
import TextAreaInput from "../../components/utils/input/TextAreaInput";
import TypeInput from "../../components/utils/input/TypeInput";
import { useNavigate } from "react-router";
import { saveRecipe } from "../../api";
import { recipeModel } from "../../models";
import { CreateRecipeContainer, CreateRecipeForm, FormCard, FormCardBody, FormCardHead } from "./CreateRecipe.styles";

type recipe = Omit<recipeModel, "image"> & {
  image: File;
};

function CreateRecipe() {
  let navigate = useNavigate();

  const myRecipe: recipe = {
    title: "",
    time: "",
    ingredients: "",
    instructions: "",
    description: "",
    image: new File([""], "file"),
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log(myRecipe);
      const formData = new FormData();
      formData.append("image", myRecipe.image);
      formData.append("data", JSON.stringify(myRecipe));
      await saveRecipe(formData);
      navigate("/");
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <CreateRecipeContainer>
      <CreateRecipeForm>
        <FormCard onSubmit={submitHandler}>
          <FormCardHead>
            <h4>Create a Recipe</h4>
          </FormCardHead>
          <FormCardBody>
            <div>
              <TypeInput
                label="Title"
                name="title"
                inputFunction={(value) => {
                  myRecipe.title = value;
                }}
                style={{
                  textColor: "white",
                  activeLineColor: "rgb(0, 188, 212)",
                }}
              />
              <TypeInput
                label="Time (min)"
                name="time"
                type="number"
                inputFunction={(value) => {
                  myRecipe.time = value;
                }}
                style={{
                  textColor: "white",
                  activeLineColor: "rgb(0, 188, 212)",
                }}
              />
            </div>
            <FileInput
              label="Upload Image"
              name="image"
              inputFunction={(file) => {
                myRecipe.image = file;
              }}
              style={{ color: "white" }}
            />
          </FormCardBody>
          <div className="ingredients">
            <TextAreaInput
              label="Description"
              name="description"
              inputFunction={(value) => {
                myRecipe.description = value;
              }}
            />
            <TextAreaInput
              label="Ingredients"
              name="ingredients"
              inputFunction={(value) => {
                myRecipe.ingredients = value;
              }}
            />
            <TextAreaInput
              label="Instructions"
              name="instructions"
              inputFunction={(value) => {
                myRecipe.instructions = value;
              }}
            />
            <GradientButton />
          </div>
        </FormCard>
      </CreateRecipeForm>
    </CreateRecipeContainer>
  );
}

export default CreateRecipe;
