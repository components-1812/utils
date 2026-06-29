import { setBooleanAttribute, getBooleanAttribute } from "./Boolean.js";
import { setNumberAttribute, getNumberAttribute } from "./Number.js";
import { setStringAttribute, getStringAttribute } from "./String.js";


export const Attr = {
    boolean: {
        set: setBooleanAttribute,
        get: getBooleanAttribute
    },
    number: {
        set: setNumberAttribute,
        get: getNumberAttribute
    },
    string: {
        set: setStringAttribute,
        get: getStringAttribute
    },
    list: {
        get:
    }
};