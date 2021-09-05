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

const initialIngredientTransformation: (ingredient: IngredientDef) => IngredientDef = (ingredient) =>
    ({
        ...ingredient,
        ...{
            beingDragged: false,
            units: [ingredient.current_unit, ...ingredient.units],
        },

    });

const getAllIngredients: (project: ProjectDef) => Promise<IngredientDef[] | null> = async (project) => {
    try {
        const response = await (await fetch(`${baseUrl(project)}/ingredients`)).json();
        const final = response.map(initialIngredientTransformation);
        console.log('final')
        console.log(final);
        return final;
    } catch(err) {
        console.error(err);
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
const updateIngredient: (project: ProjectDef, ingredient: IngredientDef) => Promise<number | null> = async (
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
    getAllIngredients: getAllIngredients,
    createIngredient: createIngredient,
    updateIngredient: updateIngredient,
    deleteIngredient: deleteIngredient,
};

export default IO;