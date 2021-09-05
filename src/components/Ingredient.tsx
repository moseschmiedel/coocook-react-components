import React, { useRef, CSSProperties } from "react";
import { Button, Form, OverlayTrigger, Popover } from "react-bootstrap";
import { CodeOutlined, DeleteRounded, DragIndicator } from "@material-ui/icons";
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from "react-dnd";
import { DragTypes } from "../util/DragDefs";
import "../util/layout.css";

import type { IngredientDef } from "../util/Definitions";
import type { DragIngredient } from "../util/DragDefs";

export interface IngredientProps {
    ingredient: IngredientDef;
    onDelete: (id: number) => void;
    onChange: (id: number, newData: any) => void;
    moveIngredient: (from: IngredientDef, to: IngredientDef) => void;
}

const ingredientStyle: CSSProperties = {
    border: "solid 2px grey",
    padding: "4px",
    borderRadius: "4px",
    width: "100%",
    height: "3rem",
};

const Ingredient: React.FC<IngredientProps> = ({
    ingredient: data,
    onDelete,
    onChange,
    moveIngredient,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const handle = useRef<HTMLDivElement>(null);

    const [, drop] = useDrop({
        accept: DragTypes.Ingredient,
        hover(item: DragIngredient, monitor: DropTargetMonitor) {
            if (!ref.current) {
                return;
            }
            const dragPosition = item.ingredient.position;
            const hoverPosition = data.position;
            const sameList: boolean = item.ingredient.prepare === data.prepare;
            if (sameList &&
                dragPosition === hoverPosition) {
                return;
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();

            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            // Determine mouse position
            const clientOffset = monitor.getClientOffset();

            // Get pixels to the top
            const hoverClientY =
                (clientOffset as XYCoord).y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (sameList && dragPosition < hoverPosition && hoverClientY < hoverMiddleY) {
                return;
            }

            // Dragging upwards
            if (sameList && dragPosition > hoverPosition && hoverClientY > hoverMiddleY) {
                return;
            }

            moveIngredient(item.ingredient, data);

            item.ingredient.position = hoverPosition;
        },
    });

    const [{ isDragging }, drag, preview] = useDrag({
        item: {
            type: DragTypes.Ingredient,
            id: data.id,
            ingredient: { ...data, ...{ beingDragged: true } },
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item: DragIngredient | undefined, monitor: any) => {
            if (item !== undefined) {
                onChange(item.id, { beingDragged: false });
            }
        },
    });

    const FullComment: React.FC<any> = (props) => {
        return <Popover id="popover-basic" content {...props}></Popover>;
    };

    preview(drop(ref));
    drag(handle);

    const dragStyle: CSSProperties = {
        border: "dashed 2px grey",
        opacity: 0.5,
    };

    return (
        <div
            ref={ref}
            className="flex flex-row align-center justify-center"
            style={
                isDragging || data.beingDragged
                    ? { ...ingredientStyle, ...dragStyle }
                    : { ...ingredientStyle }
            }
        >
            <div ref={handle} style={{ flex: "none", cursor: "move" }}>
                <DragIndicator fontSize="large" style={{ color: "grey" }} />
            </div>
            {/* Title */}
            <div style={{ minWidth: "8rem", flex: "none" }}>{data.article.name}</div>
            {/* Value */}
            <div style={{ width: "4.6rem", flex: "none" }}>
                <Form>
                    <Form.Control
                        as="input"
                        type="number"
                        step="any"
                        defaultValue={data.value}
                        onChange={(e) => {
                            const target = e.target;
                            onChange(
                                data.id,
                                Object.assign(data, {
                                    value: Number.parseFloat(target.value),
                                })
                            );
                        }}
                    />
                </Form>
            </div>
            {/* Unit */}
            <div style={{ width: "6.5rem", flex: "none" }}>
                <Form.Control
                    as="select"
                    defaultValue={data.current_unit.id}
                    onChange={(e) => {
                        onChange(
                            data.id,
                            Object.assign(data, {
                                current_unit: data.units.find(u => u.id === Number.parseInt(e.target.value))
                            })
                        );
                    }}
                >
                    {data.units.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                            {unit.short_name} ({unit.long_name})
                        </option>
                    ))}
                </Form.Control>
            </div>
            {/* Comment */}
            {/*<OverlayTrigger delay={{ show: 250, hide: 400 }} overlay={<FullComment>{data.comment}</FullComment>} placement="right">*/}
            <Form.Control as="input" type="text" defaultValue={data.comment} />
            {/* <div className="ml-truncate" style={{flexGrow: 1, marginLeft: 8, marginRight: 8, height: 'inherit', WebkitLineClamp: 2}}>
                    {data.comment}
                </div> */}
            {/*</OverlayTrigger>*/}
            {/* Delete Button */}
            <div style={{ flex: "none" }}>
                <Button variant="danger" onClick={() => onDelete(data.id)}>
                    <DeleteRounded />
                </Button>
            </div>
        </div>
    );
};

export default Ingredient;
