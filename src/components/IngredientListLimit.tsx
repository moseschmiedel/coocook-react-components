import React from 'react';
import { DragTypes } from "../util/DragDefs";
import { DropTargetMonitor, useDrop } from "react-dnd";

import type { IngredientDef } from "../util/Definitions";
import type { DragIngredient } from "../util/DragDefs";

interface LimiterProps {
    text: string;
    size: { height: string | number, width: string | number };
    appendIngredient: (droppedIngredient: IngredientDef) => void;
}

const IngredientListLimit: React.FC<LimiterProps> = ({
    text,
    size,
    appendIngredient,
}) => {
    const [, drop] = useDrop({
        accept: DragTypes.Ingredient,
        hover(item: DragIngredient, monitor: DropTargetMonitor) {
            appendIngredient(item.ingredient);
        },
    });

    return <div ref={drop} style={{height: size.height, width: size.width }}>{text}</div>;
};

export default IngredientListLimit;
