export const BooleanUtils = {

    set(element, name, value, opt = {}) {
    
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
            
        if(boolean === null) {
            console.warn(`Invalid value for attribute "${name}": "${value}". It must be a boolean, "true" or "false".`);
            return false;
        }
    
        try {
            if(validate(boolean)) {
                element.toggleAttribute(name, boolean);
                return true;
            }
        }
        catch (error) {
            console.warn(`[Boolean Exception] ${element.tagName.toLowerCase()}[${name}]`, error);
        }

        return false;
    },
    
    get(element, name, defaultValue = false){
    
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