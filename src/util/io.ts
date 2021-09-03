import { backend } from '../constants';
import type { IngredientDef, ProjectDef } from './Definitions';


const baseUrl: (project: ProjectDef) => string = (project) => {
    switch (project.type) {
            case 'dish':
                return `${backend}/project/${project.id}/${project.name}/dish/${project.specificId}`;
            case 'recipe':
                return `${backend}/project/${project.id}/${project.name}/recipe/${project.specificId}`;
    }
};

const getAllNormalIngredients: (project: ProjectDef) => Promise<IngredientDef[] | null> = async (project) => {
    try {
        const response = await (await fetch(`${baseUrl(project)}/ingredients`)).json();
        console.log(response);
        return response.data.map(
            (ingrList: IngredientDef[]) =>
                ingrList.map((ingr: IngredientDef) => ({
                    ...ingr,
                    ...{ beingDragged: false },
                })));
    } catch(err) {
        return null;
    }
};
const getAllPreparedIngredients: (project: ProjectDef) => Promise<IngredientDef[] | null> = async (project) => {
    try {
        const response = await (await fetch(`${baseUrl(project)}/ingredients`)).json();
        return response.data.map(
            (ingrList: IngredientDef[]) =>
                ingrList.map((ingr: IngredientDef) => ({
                    ...ingr,
                    ...{ beingDragged: false },
                })));
    } catch(err) {
        return null;
    }
};
const createIngredient: (project: ProjectDef, ingredient: IngredientDef) => Promise<number | null> = async (
    project,
    ingredient
) => {
    try {
        const response = await fetch(`${baseUrl(project)}/ingredients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ingredient),
        });

        const id = (await response.json()).data;
        if (!isNaN(id)) {
            return id;
        } else {
            return null;
        }
    } catch (err) {
        return null;
    }
};
const putIngredient: (project: ProjectDef, ingredient: IngredientDef) => Promise<number | null> = async (
    project,
    ingredient
) => {
    try {
        const response = await fetch(`${baseUrl(project)}/ingredients/${ingredient.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ingredient),
        });

        await response.json();
        return ingredient.id;
    } catch (err) {
        return null;
    }
};
const deleteIngredient: (project: ProjectDef, ingredient: IngredientDef) => Promise<number | null> = async (
    project,
    ingredient
) => {
    try {
        const response = await fetch(`${baseUrl(project)}/ingredients/${ingredient.id}`, {
            method: 'DELETE',
        });

        await response.json();
        return ingredient.id;
    } catch (err) {
        return null;
    }
};

const IO = {
    getAllNormalIngredients: getAllNormalIngredients,
    getAllPreparedIngredients: getAllPreparedIngredients,
    createIngredient: createIngredient,
    putIngredient: putIngredient,
    deleteIngredient: deleteIngredient,
};

export default IO;