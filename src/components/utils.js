// import Assets from "@assets";

export function isURL(value) {
    return (
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("data:image")
    );
}

// export function getImage(value) {
//     if (isURL(value)) return { uri: value };
//     return Assets[value] ?? null;
// }
