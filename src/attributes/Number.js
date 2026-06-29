
export function setNumberAttribute(element, name, value, opt = {}) {

    if(value == null) {
        element.removeAttribute(name);
        return;
    }

    const {
        validate = () => true,
        message = `Invalid value for attribute "${name}": "${value}". It must be a number.`
    } = opt;

    const number = Number(value);

    if(Number.isNaN(number)) {
        console.warn(message);
        return;
    }

    try {
        if(validate(number)) element.setAttribute(name, number);
    }
    catch (error) {
        console.warn(message, error);
    }
}

export function getNumberAttribute(element, name, defaultValue = NaN){

    const value = element.getAttribute(name);

    if(value == null) return defaultValue;
    if(value.trim() === '') return defaultValue;

    const number = Number(value);

    if(Number.isNaN(number)) return defaultValue;

    return number;
}
