
export function setStringAttribute(element, name, value, opt = {}) {

    if(value == null) {
        element.removeAttribute(name);
        return;
    }

    const {
        validate = () => true,
        message = `Invalid value for attribute "${name}": "${value}".`
    } = opt;

    value = String(value).trim();

    try {
        if(validate(value)) element.setAttribute(name, value);
    }
    catch (error) {
        console.warn(message, error);
    }
}

export function getStringAttribute(element, name, defaultValue = null, opt = {}){

    let value = element.getAttribute(name);

    if(value == null) return defaultValue;

    const {
        trim = true,
        validate = () => true,
    } = opt;

    if(trim) value = value.trim();
    
    return validate(value) ? value : defaultValue;
}