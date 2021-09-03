export interface IngredientDef {
    id: number;
    position: number;
    prepare: boolean;
    article: ArticleDef;
    value: number;
    currentUnit: number;
    units: UnitDef[];
    comment: string;
    beingDragged: boolean;
}

export interface ArticleDef {
    name: string,
    comment: string,
}

export interface UnitDef {
    id: number;
    name: string;
}

export interface ProjectDef {
    type: 'recipe' | 'dish';
    id: number;
    name: string;
    specificId: number;
}