export const BooleanUtils = {

    set(element, name, value, opt = {}) {

        if(!element || !name) console.warn(`[Set Boolean Attribute] element or attribute name are required.`);
    
        if(value == null) {
            element.removeAttribute(name);
            return;
        }
    
        const {  
            validate = () => true,
        } = opt;
    
        const boolean = (() => {
    
            if(typeof value === 'boolean') return value;
    
            if(typeof value === 'string'){
                if(value.toLowerCase() === 'true') return true;
                if(value.toLowerCase() === 'false') return false;
            }
    
            return null;
        })();
            
        
    
        try {

            if(boolean === null) {
                throw new Error(`Invalid value for attribute "${name}": "${value}". It must be a boolean, "true" or "false".`);
            }

            if(validate(boolean)) {
                element.toggleAttribute(name, boolean);
                return true;
            }
        }
        catch (error) {
            console.warn(`[Set Boolean Attribute] ${element.tagName.toLowerCase()}[${name}]`, error);
        }

        return false;
    },
    
    get(element, name, defaultValue = false){

        if(!element || !name) console.warn(`[Get Boolean Attribute] element or attribute name are required.`);
    
        const value = element.getAttribute(name);
    
        if(typeof value === 'string'){
    
            if(value.toLowerCase() === 'true') return true;
            if(value.toLowerCase() === 'false') return false;
            
            return true;
        }
            
        return defaultValue;
    }
}

export default BooleanUtils;