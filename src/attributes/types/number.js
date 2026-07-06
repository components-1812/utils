
export const NumberUtils = {

    set(element, name, value, opt = {}) {        
        
        if(!element || !name) console.warn(`[Set Number Attribute] element or attribute name are required.`);

        if(value == null) {
            element.removeAttribute(name);
            return;
        }

        const {
            validate = () => true,
        } = opt;

        
        try {
    
            const number = Number(value);
    
            if(Number.isNaN(number)) {
                throw new Error(`Invalid value for attribute "${name}": "${value}". It must be a number.`);
            }

            if (validate(number)) {
                element.setAttribute(name, number);
                return true;
            }
        }
        catch (error) {
            console.warn(`[Set Number Attribute] ${element.tagName.toLowerCase()}[${name}]`, error);
        }

        return false;
    },

    get(element, name, defaultValue = NaN){

        if(!element || !name) console.warn(`[Get Number Attribute] element or attribute name are required.`);

        const value = element.getAttribute(name);

        if (value == null) return defaultValue;
        if (value.trim() === '') return defaultValue;

        const number = Number(value);

        if (Number.isNaN(number)) return defaultValue;

        return number;
    }
}

export default NumberUtils;
