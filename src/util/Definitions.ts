export interface IngredientDef {
    id: number;
    position: number;
    preparation: boolean;
    article: string;
    value: number;
    currentUnit: number;
    units: UnitDef[];
    comment: string;
    beingDragged: boolean;
}

export interface UnitDef {
    id: number;
    name: string;
}
