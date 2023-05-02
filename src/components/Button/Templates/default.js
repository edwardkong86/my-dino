import React from "react";

const Default = (props) => {
    //Access to main props
    //Injected at runtime
    const { item, managedCallback } = props;

    //Always check to not render with error ;)
    if (item === undefined) return null;

    const { action, theme = "", label = "", extra = {}, disabled } = item;

    const onClick = () => {
        action && managedCallback({ item, validate: extra.validate ?? false });
    };
    console.log("button", theme)
    //Access to all props that introduced in element.
    return (<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onClick}>{label}</button>);


};

export default Default;