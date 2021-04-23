import React, { useRef } from "react";
import { DragTypes } from "../util/DragDefs";
import { DropTargetMonitor, useDrop } from "react-dnd";

import type { IngredientDef } from "../util/Definitions";
import type { DragIngredient } from "../util/DragDefs";

interface PlaceholderProps {
    text: string;
    dropIngredient: (droppedIngredient: IngredientDef) => void;
}

const IngredientPlaceholder: React.FC<PlaceholderProps> = ({
    text,
    dropIngredient,
}) => {
    const [, drop] = useDrop({
        accept: DragTypes.Ingredient,
        hover(item: DragIngredient, monitor: DropTargetMonitor) {
            dropIngredient(item.ingredient);
        },
    });

    return <div ref={drop}>{text}</div>;
};

export default IngredientPlaceholder;
