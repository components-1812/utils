
const JsonUtils = {

    get(element, name, defaultValue = {}, opt = {}) {

        if(!element || !name) console.warn(`[Get Json Attribute] element or attribute name are required.`);

        const value = element.getAttribute(name);

        if(value == null) return defaultValue;

        const { 
            validate = () => true,
        } = opt;

        try {

            const json = JSON.parse(value);

            if(validate(json)) return json;
        } 
        catch(error) {

            console.warn(`[Get Json Attribute] ${element.tagName.toLowerCase()}[${name}]`, error);
        }
        
        return defaultValue;
    },

    set(element, name, value, opt = {}) {

        if(!element || !name) console.warn(`[Set Json Attribute] element or attribute name are required.`);

        if(value == null) {
            element.removeAttribute(name);
            return;
        }

        const {
            validate = () => true,
        } = opt;

        try {
            const json = JSON.stringify(value);

            if(validate(json)) {
                element.setAttribute(name, json);
                return true;
            }
        } 
        catch(error) {
            console.warn(`[Set Json Attribute] ${element.tagName.toLowerCase()}[${name}]`, error);
        }

        return false;
    }
}

export default JsonUtils;