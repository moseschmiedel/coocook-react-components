import React, { useCallback, useEffect, useState } from "react";
import { List } from "../util/List";
import Ingredient from "./Ingredient";
import IngredientListLimit from "./IngredientListLimit";
import { Card } from "react-bootstrap";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./IngredientsEditor.css";
import "../util/layout.css";
import IO from "../util/io";

import type { IngredientDef, ProjectDef } from "../util/Definitions";

export interface IngredientsEditorProps {
    project: ProjectDef;
}


const IngredientsEditor: React.FC<IngredientsEditorProps> = ({
    project
}) => {

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
    const [nPIngredients, setNPIngredients] = useState<IngredientDef[]>([]);
    const [pIngredients, setPIngredients] = useState<IngredientDef[]>([]);

    const fetchIngredients: () => Promise<void> = async () => {
        const normalIngrs = (await IO.getAllNormalIngredients(project)) || [];
        const preparedIngrs = (await IO.getAllPreparedIngredients(project)) || [];
        setNPIngredients(normalIngrs);
        setPIngredients(preparedIngrs);
    };

    useEffect(() => {
        fetchIngredients();
    }, []);

    // If `a` comes before `b` return should be negative
    const sortByPosition = (a: IngredientDef, b: IngredientDef) =>
        a.position - b.position;

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
                <p>{JSON.stringify(IO.getAllNormalIngredients(project))}</p>
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
