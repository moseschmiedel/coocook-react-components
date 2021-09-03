import React, { useCallback, useEffect, useState } from "react";
import { MaybeUtils, Just, Nothing } from "../util/Maybe";
import { List } from "../util/List";
import Ingredient from "./Ingredient";
import IngredientPlaceholder from "./IngredientPlaceholder";
import { Card } from "react-bootstrap";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import { backend } from "../constants";
import "./IngredientsEditor.css";
import "../util/layout.css";

import type { IngredientDef } from "../util/Definitions";
import type { Maybe } from "../util/Maybe";

export interface IngredientsEditorProps {
    projectId: number;
    dishId?: number;
    recipeId?: number;
}

const IngredientsEditor: React.FC<IngredientsEditorProps> = ({
    projectId,
    dishId,
    recipeId,
}) => {
    if ((dishId && recipeId) || (!dishId && !recipeId)) {
        throw new Error("You must define either a dish ID or a recipe ID.");
    }

    const baseUrl: string = (() => {
        if (dishId) {
            return `${backend}/projects/${projectId}/dishes/${dishId}`;
        } else if (recipeId) {
            return `${backend}/projects/${projectId}/recipes/${recipeId}`;
        } else {
            return "";
        }
    })();

    const getAllNormalIngredients: () => Maybe<IngredientDef[]> = () => {
        let ingredients: Maybe<IngredientDef[]> = Nothing();
        axios
            .get(`${baseUrl}/ingredients`)
            .then((res) => (ingredients = Just(res.data)));
        MaybeUtils.map(
            (ingrList: IngredientDef[]) =>
                ingrList.map((ingr: IngredientDef) => ({
                    ...ingr,
                    ...{ beingDragged: false },
                })),
            ingredients
        );

        return ingredients;
    };

    const getAllPreparedIngredients: () => Maybe<IngredientDef[]> = () => {
        let ingredients: Maybe<IngredientDef[]> = Nothing();
        axios
            .get(`${baseUrl}/prepared_ingredients`)
            .then((res) => (ingredients = Just(res.data)));
        MaybeUtils.map(
            (ingrList: IngredientDef[]) =>
                ingrList.map((ingr: IngredientDef) => ({
                    ...ingr,
                    ...{ beingDragged: false },
                })),
            ingredients
        );

        return ingredients;
    };

    const createIngredient: (ingredient: IngredientDef) => Maybe<number> = (
        ingredient
    ) => {
        let ingredients_id: Maybe<number> = Nothing();
        axios.post(`${baseUrl}/ingredients`, ingredient).then((res) => {
            if (!isNaN(res.data)) {
                ingredients_id = Just(res.data);
            }
        });
        return ingredients_id;
    };

    const putIngredient: (ingredient: IngredientDef) => Maybe<{}> = (
        ingredient
    ) => {
        try {
            axios
                .put(`${baseUrl}/ingredients/${ingredient.id}`, ingredient)
                .then();
            return Just({});
        } catch (error) {
            return Nothing();
        }
    };

    const deleteIngredient: (ingredient: IngredientDef) => Maybe<{}> = (
        ingredient
    ) => {
        try {
            axios.delete(`${baseUrl}/ingredients/${ingredient.id}`).then();
            return Just({});
        } catch (error) {
            return Nothing();
        }
    };
    const initialNonPreparedIngredients: IngredientDef[] = [
        {
            id: 1,
            position: 1,
            preparation: false,
            article: "Öl",
            value: 2,
            currentUnit: 1,
            units: [
                { id: 1, name: "l (Liter)" },
                { id: 3, name: "kg (Kilogramm)" },
                { id: 4, name: "ml (Milliliter)" },
            ],
            comment: "",
            beingDragged: false,
        },
        {
            id: 3,
            position: 3,
            preparation: false,
            article: "Kartoffeln",
            value: 2,
            currentUnit: 1,
            units: [
                { id: 1, name: "l (Liter)" },
                { id: 3, name: "kg (Kilogramm)" },
                { id: 4, name: "ml (Milliliter)" },
            ],
            comment: "",
            beingDragged: false,
        },
        {
            id: 2,
            position: 2,
            preparation: false,
            article: "Zwiebeln",
            value: 4,
            currentUnit: 2,
            units: [
                { id: 2, name: "Stück" },
                { id: 1, name: "l (Liter)" },
                { id: 3, name: "kg (Kilogramm)" },
                { id: 4, name: "ml (Milliliter)" },
            ],
            comment:
                "roteroteroteroteroteroteroteroteroteroteroteroteroteroteroteroteroteroteroteroteroteroteroteroteroteroteroteroteroteroteroteroteroteroteroteroteroterote",
            beingDragged: false,
        },
    ];
    const [nPIngredients, setNPIngredients] = useState(
        initialNonPreparedIngredients
    );

    const initialPreparedIngredients: IngredientDef[] = [];
    const [pIngredients, setPIngredients] = useState(
        initialPreparedIngredients
    );

    // If `a` comes before `b` return should be negative
    const sortByPosition = (a: IngredientDef, b: IngredientDef) =>
        a.position - b.position;

    useEffect(() => {
        MaybeUtils.map(
            (ingrs) => setNPIngredients(ingrs),
            getAllNormalIngredients()
        );
        MaybeUtils.map(
            (ingrs) => setPIngredients(ingrs),
            getAllPreparedIngredients()
        );
    }, []);

    const removeIngredient = useCallback(
        (id: number) => {
            setNPIngredients((prevState: IngredientDef[]) =>
                prevState.filter((elem: IngredientDef) => elem.id !== id)
            );
            setPIngredients((prevState: IngredientDef[]) =>
                prevState.filter((elem: IngredientDef) => elem.id !== id)
            );
        },
        [nPIngredients, pIngredients]
    );

    const updateIngredient = useCallback(
        (id: number, newData: any) => {
            setNPIngredients((prevState: IngredientDef[]) =>
                prevState.map((elem: IngredientDef) =>
                    elem.id === id ? { ...elem, ...newData } : elem
                )
            );
            setPIngredients((prevState: IngredientDef[]) =>
                prevState.map((elem: IngredientDef) =>
                    elem.id === id ? { ...elem, ...newData } : elem
                )
            );
        },
        [nPIngredients, pIngredients]
    );

    const equalsById = (ingr1: IngredientDef) => (ingr2: IngredientDef) =>
        ingr1.id === ingr2.id;

    const moveIngredient = useCallback(
        (source: IngredientDef, target: IngredientDef) => {
            if (
                List.contains(nPIngredients)(equalsById(source)) &&
                List.contains(nPIngredients)(equalsById(target))
            ) {
                setNPIngredients((prevState) =>
                    prevState
                        .map((elem: IngredientDef) => {
                            if (elem.position === source.position) {
                                return {
                                    ...elem,
                                    ...{
                                        position: target.position,
                                        preparation: false,
                                    },
                                };
                            } else if (elem.position === target.position) {
                                return {
                                    ...elem,
                                    ...{
                                        position: source.position,
                                        preparation: false,
                                    },
                                };
                            } else {
                                return elem;
                            }
                        })
                        .sort(sortByPosition)
                );
            } else
            if (
                List.contains(pIngredients)(equalsById(source)) &&
                List.contains(nPIngredients)(equalsById(target))
            ) {
                /**
                 * We want to put an Ingredient from the prepared Ingredients List in the not prepared List,
                 * to do this we need to find the place in nPIngredients, where the Ingredient should be inserted
                 * and increase the position of all Ingredients that come after that position
                 * The `preparation` property of the ingredient must be updated because, the ingredient is now not prepared
                 */
                removeIngredient(source.id);
                setNPIngredients((prevState) =>
                    prevState
                        .map((elem: IngredientDef) => {
                            if (elem.position >= target.position) {
                                return {
                                    ...elem,
                                    ...{ position: elem.position + 1 },
                                };
                            } else {
                                return elem;
                            }
                        })
                        .concat([
                            {
                                ...source,
                                ...{
                                    position: target.position,
                                    preparation: false,
                                },
                            },
                        ])
                        .sort(sortByPosition)
                );
            } else
            if (
                List.contains(nPIngredients)(equalsById(source)) &&
                List.contains(pIngredients)(equalsById(target))
            ) {
                /**
                 * We want to put an Ingredient from the prepared Ingredients List in the not prepared List,
                 * to do this we need to find the place in nPIngredients, where the Ingredient should be inserted
                 * and increase the position of all Ingredients that come after that position
                 * The `preparation` property of the ingredient must be updated because, the ingredient is now prepared
                 */
                removeIngredient(source.id);
                setPIngredients((prevState) =>
                    prevState
                        .map((elem: IngredientDef) => {
                            if (elem.position >= target.position) {
                                return {
                                    ...elem,
                                    ...{ position: elem.position + 1 },
                                };
                            } else {
                                return elem;
                            }
                        })
                        .concat([
                            {
                                ...source,
                                ...{
                                    position: target.position,
                                    preparation: true,
                                },
                            },
                        ])
                        .sort(sortByPosition)
                );
            } else
            if (
                List.contains(pIngredients)(equalsById(source)) &&
                List.contains(pIngredients)(equalsById(target))
            ) {
                setPIngredients((prevState) =>
                    prevState
                        .map((elem: IngredientDef) => {
                            if (elem.position === source.position) {
                                return {
                                    ...elem,
                                    ...{
                                        position: target.position,
                                        preparation: true,
                                    },
                                };
                            } else if (elem.position === target.position) {
                                return {
                                    ...elem,
                                    ...{
                                        position: source.position,
                                        preparation: true,
                                    },
                                };
                            } else {
                                return elem;
                            }
                        })
                        .sort(sortByPosition)
                );
            }
        },
        [nPIngredients, pIngredients]
    );

    const appendIngredientPrepared = (
        droppedIngredient: IngredientDef
    ) => {
            removeIngredient(droppedIngredient.id);
            setPIngredients((prevState) =>
                prevState.concat([
                    {
                        ...droppedIngredient,
                        ...{ position: prevState.length+1, preparation: true },
                    },
                ])
            );
    };
    const prependIngredientPrepared = (
        droppedIngredient: IngredientDef
    ) => {
            removeIngredient(droppedIngredient.id);
            setPIngredients((prevState) => {
                let newState: IngredientDef[] =
                    prevState.map((elem: IngredientDef) => ({...elem, ...{ position: elem.position+1 }}));
                return [
                    {
                        ...droppedIngredient,
                        ...{ position: prevState.length, preparation: true },
                    },
                ].concat(newState);
            }
            );
    };

    const appendIngredientNotPrepared = (
        droppedIngredient: IngredientDef
    ) => {
            removeIngredient(droppedIngredient.id);
            setNPIngredients((prevState) =>
                prevState.concat([
                    {
                        ...droppedIngredient,
                        ...{ position: prevState.length+1, preparation: false },
                    },
                ])
            );
    };
    const prependIngredientNotPrepared = (
        droppedIngredient: IngredientDef
    ) => {
            removeIngredient(droppedIngredient.id);
            setNPIngredients((prevState) => {
                let newState: IngredientDef[] =
                    prevState.map((elem: IngredientDef) => ({...elem, ...{ position: elem.position+1 }}));
                return [
                    {
                        ...droppedIngredient,
                        ...{ position: prevState.length, preparation: true },
                    },
                ].concat(newState);
            }
            );
    };

    return (
        <Card>
            <Card.Header>
                <h3>Ingredients</h3>
            </Card.Header>
            <Card.Body>
                <DndProvider backend={HTML5Backend}>
                    <div
                        className="flex flex-column align-start"
                        id="ingredients-editor"
                    >
                        <div className="list-header">Normal Ingredients</div>
                        <div
                            style={{ width: "100%" }}
                            className="flex flex-column align-start"
                            id="not-prepared-items"
                        >
                        <IngredientListLimit
                        appendIngredient={prependIngredientNotPrepared}
                        size={{ height: '1.5rem', width: '100%' }}
                        text={""}
                        />
                            {nPIngredients.map((ingr_def) => (
                                <Ingredient
                                    key={ingr_def.id}
                                    onDelete={removeIngredient}
                                    onChange={updateIngredient}
                                    moveIngredient={moveIngredient}
                                    ingredient={ingr_def}
                                />
                            ))}
                            <IngredientListLimit
                            appendIngredient={appendIngredientNotPrepared}
                            size={{ height: '3rem', width: '100%' }}
                            text={
                                    nPIngredients.length === 0
                                        ? "There are no normal ingredients yet. Drag some ingredients here!"
                                        : ""
                            }
                            />
                        </div>
                        <div className="list-header">Prepared Ingredients</div>
                        <div
                            style={{ width: "100%" }}
                            className="flex flex-column align-start"
                            id="prepared-items"
                        >
                        <IngredientListLimit
                        appendIngredient={prependIngredientPrepared}
                        size={{ height: '1.5rem', width: '100%' }}
                        text={""}
                        />
                            {pIngredients.map((ingr_def) => (
                                <Ingredient
                                    key={ingr_def.id}
                                    onDelete={removeIngredient}
                                    onChange={updateIngredient}
                                    moveIngredient={moveIngredient}
                                    ingredient={ingr_def}
                                />
                            ))}
                            <IngredientListLimit
                            appendIngredient={appendIngredientPrepared}
                            size={{ height: '3rem', width: '100%' }}
                            text={
                                    pIngredients.length === 0
                                        ? "There are no prepared ingredients yet. Drag some ingredients here to make them prepared!"
                                        : ""
                            }
                            />
                        </div>
                    </div>
                </DndProvider>
            </Card.Body>
        </Card>
    );
};

export default IngredientsEditor;
