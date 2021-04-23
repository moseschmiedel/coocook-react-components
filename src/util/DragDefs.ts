import type { IngredientDef } from "./Definitions";

export const DragTypes = {
    Ingredient: "INGREDIENT",
};

export interface DragIngredient {
    id: number;
    type: string;
    ingredient: IngredientDef;
}
