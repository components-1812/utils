
export const NumberUtils = {

    set(element, name, value, opt = {}) {

        if(value == null) {
            element.removeAttribute(name);
            return;
        }

        const {
            validate = () => true,
        } = opt;

        const number = Number(value);

        if(Number.isNaN(number)) {
            console.warn(`Invalid value for attribute "${name}": "${value}". It must be a number.`);
            return false;
        }

        try {
            if (validate(number)) {
                element.setAttribute(name, number);
                return true;
            }
        }
        catch (error) {
            console.warn(`[Number Exception] ${element.tagName.toLowerCase()}[${name}]`, error);
        }

        return false;
    },

    get(element, name, defaultValue = NaN){

        const value = element.getAttribute(name);

        if (value == null) return defaultValue;
        if (value.trim() === '') return defaultValue;

        const number = Number(value);

        if (Number.isNaN(number)) return defaultValue;

        return number;
    }
}

export default NumberUtils;
