import React from "react";
import ReactDOM from "react-dom";
import IngredientsEditor from "./components/IngredientsEditor";
import "bootstrap/dist/css/bootstrap.min.css";

import type { ProjectDef } from './util/Definitions';

const project: ProjectDef = {
    // @ts-ignore
    type: ingredientsEditorData.dish_id ? 'dish' : 'recipe',
    // @ts-ignore
    id: ingredientsEditorData.project_id,
    // @ts-ignore
    name: ingredientsEditorData.project_name,
    // @ts-ignore
    specificId: ingredientsEditorData.dish_id || ingredientsEditorData.recipe_id,
};

ReactDOM.render(
    <React.StrictMode>
        <IngredientsEditor project={project} />
    </React.StrictMode>,

    document.getElementById("ingredients-editor")
);

if (import.meta.hot) {
    import.meta.hot.accept();
}
