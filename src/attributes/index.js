import { setBooleanAttribute, getBooleanAttribute } from "./Boolean.js";
import { AttributeTokenList } from "./AttributeTokenList.js";
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
        cache: new WeakMap(),
        get(element, attribute, opt = {}){

            if(!element || !attribute) throw new Error("Element and attribute are required to get an attribute token list");

            const vault = this.cache.get(element) ?? this.cache.set(element, new Map()).get(element);

            const list = vault.get(attribute) ?? vault.set(attribute, new AttributeTokenList(element, attribute, opt)).get(attribute);

            return list;
        }
    }
};