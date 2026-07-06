
const JsonUtils = {

    get(element, name, defaultValue = {}, opt = {}) {

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

            console.warn(`[JSON Exception] ${element.tagName.toLowerCase()}[${name}]`, error);
        }
        
        return defaultValue;
    },

    set(element, name, value, opt = {}) {

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
            console.warn(`[JSON Exception] ${element.tagName.toLowerCase()}[${name}]`, error);
        }

        return false;
    }
}

export default JsonUtils;