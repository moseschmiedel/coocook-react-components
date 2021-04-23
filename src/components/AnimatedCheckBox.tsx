import React from "react";
import { useState } from "react";
import {
    CheckBoxRounded,
    CheckBoxOutlineBlankRounded,
} from "@material-ui/icons";

export interface ICheckBoxProps {
    checked: boolean;
    onCheck: () => void;
}

const AnimatedCheckBox: React.FC<ICheckBoxProps> = (props) => {
    return (
        <div onClick={props.onCheck}>
            {props.checked ? (
                <CheckBoxRounded color="primary" />
            ) : (
                <CheckBoxOutlineBlankRounded />
            )}
        </div>
    );
};

export default AnimatedCheckBox;
