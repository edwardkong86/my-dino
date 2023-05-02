import React from "react";

const Default = (props) => {
    //Access to main props
    //Injected at runtime
    const { item, managedCallback } = props;

    //Always check to not render with error ;)
    if (item === undefined) return null;

    const { name = "", action, theme = "", label = "", extra = {}, disabled } = item;

    const onClick = () => {
        action && managedCallback({ item, validate: extra.validate ?? false });
    };
    console.log("button", theme)
    //Access to all props that introduced in element.
    return (<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id={name} type="text" placeholder={label} />);

};

export default Default;