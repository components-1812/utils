import { createElement } from "./createElement.js";
import { query } from "./query.js";


export const ComponentUtils = {
    create: {
        html: createElement((tagName) => {
            return document.createElement(tagName)
        }),
        svg: createElement((tagName) => {
            return document.createElementNS('http://www.w3.org/2000/svg', tagName)
        })
    },
    query
}
    
export default ComponentUtils;