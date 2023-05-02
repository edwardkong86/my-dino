import React from "react";

import { Button } from "./Button";
// import { Fieldset } from "./Fieldset";
import { Label } from "./Label";
import { Text } from "./Text";
// import { Image } from "./Image";
// import { List } from "./List";
// import { Modal } from "./Modal";
// import { Radiobox } from "./Radiobox";
// import { Select } from "./Select";
// import { Toggle } from "./Toggle";
// import { Checkbox } from "./checkbox";
// import { Switch } from "./Switch";

const Components = {
    button: (props) => <Button {...props} />,
    // fieldset: (props) => <Fieldset {...props} />,
    label: (props) => <Label {...props} />,
    text: (props) => <Text {...props} />,
    // image: (props) => <Image {...props} />,
    // list: (props) => <List {...props} />,
    // select: (props) => <Select {...props} />,
    // radiobox: (props) => <Radiobox {...props} />,
    // modal: (props) => <Modal {...props} />,
    // toggle: (props) => <Toggle {...props} />,
    // checkbox: (props) => <Checkbox {...props} />,
    // switch: (props) => <Switch {...props} />,
};

export const renderComponent = (type, propsItems) => {
    console.log("renderComponent", type, propsItems);
    // find the respective type from dictionary
    const SelectedComponent = Components && Components[type];
    // to ensure it is not undefined
    // prevent rendering error
    if (SelectedComponent === undefined) return null;

    return SelectedComponent({ ...propsItems });
};

export const validationResolver = {
    noteq: async (item, value) => {
        console.log("validationResolver-noteq", item, value, value === item.value);
        return !(value === item.value);
    },
    eq: async (item, value) => {
        console.log("validationResolver-eq", item, value, value === item.value);
        return value === item.value;
    },
    exist: async (item, value) => {
        return value !== "";
    },
    hasValue: async (item, value) => {
        console.log("validationResolver-hasValue", item, value);
        return value !== "" || false;
    },
    hasNoValue: async (item, value) => {
        console.log("validationResolver-hasValue-No", item, value);
        return value === undefined || false;
    },
    hasObject: async (item, value) => {
        console.log("validationResolver-hasObject", value);
        return value !== null;
    },
};
