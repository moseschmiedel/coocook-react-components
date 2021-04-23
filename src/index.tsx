import React from "react";
import ReactDOM from "react-dom";
import IngredientsEditor from "./components/IngredientsEditor";
import "bootstrap/dist/css/bootstrap.min.css";

const divArguments = {
    projectId: 1,
    dishId: 1,
};

ReactDOM.render(
    <React.StrictMode>
        <IngredientsEditor {...divArguments} />
    </React.StrictMode>,

    document.getElementById("root")
);

if (import.meta.hot) {
    import.meta.hot.accept();
}
