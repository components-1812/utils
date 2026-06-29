//MARK: set / get boolean
export function setBooleanAttribute(element, name, value, opt = {}) {

    if(value == null) {
        element.removeAttribute(name);
        return;
    }

    const {  
        validate = () => true,
        message = `Invalid value for attribute "${name}": "${value}". It must be a boolean.`
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
        console.warn(message);
        return;
    }

    try {
        if(validate(boolean)) element.toggleAttribute(name, boolean);
    }
    catch (error) {
        console.warn(message, error);
    }
}

export function getBooleanAttribute(element, name, defaultValue = false){

    const value = element.getAttribute(name);

    if(typeof value === 'string'){

        if(value.toLowerCase() === 'true') return true;
        if(value.toLowerCase() === 'false') return false;
        
        return true;
    }
        
    return defaultValue;
}
