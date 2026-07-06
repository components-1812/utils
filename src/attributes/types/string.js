
export const StringUtils = {

    set(element, name, value, opt = {}) {

        if(!element || !name) console.warn(`[Set String Attribute] element or attribute name are required.`);
    
        if(value == null) {
            element.removeAttribute(name);
            return;
        }
    
        const {
            validate = () => true
        } = opt;
    
        value = String(value).trim();
    
        try {
            if(validate(value)) {
                element.setAttribute(name, value);
                return true;
            }
        }
        catch (error) {
            console.warn(`[Set String Attribute] ${element.tagName.toLowerCase()}[${name}]`, error);
        }

        return false;
    },

    get(element, name, defaultValue = null, opt = {}){

        if(!element || !name) console.warn(`[Get String Attribute] element or attribute name are required.`);
    
        let value = element.getAttribute(name);
    
        if(value == null) return defaultValue;
    
        const {
            trim = true,
            validate = () => true,
        } = opt;
    
        if(trim) value = value.trim();
        
        return validate(value) ? value : defaultValue;
    }
}

export default StringUtils;