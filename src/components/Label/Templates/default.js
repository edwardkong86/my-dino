import React from "react";

const Default = (props) => {
    //Access to main props
    //Injected at runtime
    const { item, managedCallback } = props;

    //Always check to not render with error ;)
    if (item === undefined) return null;

    const { name = "", action, theme = "", label = "", extra = {}, disabled } = item;

    console.log("label", theme)
    //Access to all props that introduced in element.
    return (<label class="block text-white-700 text-sm font-bold mb-2" for={name}>{label}</label>);


};

export default Default;