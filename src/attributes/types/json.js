
const JsonUtils = {

    /**
     * Retrieves and parses JSON data from a DOM element in order of priority:
     * 1. Custom callback (`opt.get`)
     * 2. HTML attribute (`attribute`)
     * 3. Script tag in the Light DOM (`script`)
     * 
     * @template T
     * @param {HTMLElement} element - The DOM element to read data from.
     * @param {string} name - The property name, attribute name, or script tag's data-name.
     * @param {T} [defaultValue={}] - The default value to return if no data is found or parsing fails.
     * @param {Object} [opt={}] - Configuration options.
     * @param {function(T): boolean} [opt.validate=()=>true] - Validation function for the parsed JSON. Must return true if valid.
     * @param {function(HTMLElement, string): (string|T|null)} [opt.get=()=>null] - Callback to read directly from a property or variable of the element.
     * @param {function(string): *} [opt.parse=JSON.parse] - Custom deserialization (parsing) function.
     * @param {boolean} [opt.attribute=true] - If true, searches for data in the HTML attribute.
     * @param {boolean} [opt.script=true] - If true, searches for data in a `<script type="application/json" data-name="[name]">` tag.
     * @returns {T} The parsed and validated JSON object, or the default value.
     */
    get(element, name, defaultValue = {}, opt = {}) {

        if(!element || !name) {
            console.warn(`[Get Json Attribute] element or attribute name are required.`);
            return defaultValue;
        }

        const { 
            validate = () => true,
            get = () => null,
            parse = (value) => JSON.parse(value),
            attribute = true,
            script = true
        } = opt;

        const value = get?.(element, name) ?? 
            (attribute ? element.getAttribute(name) : null) ?? 
            (script ? element.querySelector(`script[type="application/json"][data-name="${name}"]`)?.textContent : null);

        if(value == null) return defaultValue;

        try {

            const json = typeof value === 'string' ? parse(value) : value;

            if(validate(json)) return json;
        } 
        catch(error) {

            console.warn(`[Get Json Attribute] ${element.tagName.toLowerCase()}[${name}]`, error);
        }
        
        return defaultValue;
    },

    /**
     * Saves or removes JSON data on a DOM element or via a custom callback.
     * Supports lazy evaluation (via raw function callback) to optimize performance.
     * 
     * @template T
     * @param {HTMLElement} element - The DOM element where data will be persisted.
     * @param {string} name - The attribute name or resource identifier.
     * @param {T|null|undefined} value - The value to save (Object, Array, String, or null/undefined to remove it).
     * @param {Object} [opt={}] - Configuration options.
     * @param {function(T, function(): string): boolean} [opt.validate=()=>true] - Validation function that receives the parsed value and a lazy function returning the stringified JSON.
     * @param {function(T|null, function(): string): boolean} [opt.set] - Custom persistence callback. Defaults to setting or removing the HTML attribute.
     * @param {function(string): T} [opt.parse=JSON.parse] - Deserialization function if the input value is provided as a string.
     * @param {function(T): string} [opt.stringify=JSON.stringify] - Serialization function to convert the value to a JSON string.
     * @returns {boolean} Returns true if the data was successfully validated and saved, otherwise false.
     */
    set(element, name, value, opt = {}) {

        if(!element || !name){
            console.warn(`[Set Json Attribute] element or attribute name are required.`);
            return false;
        }

        const {
            validate = () => true,
            set = (value, raw) => {
                value != null ?
                    element.setAttribute(name, raw()) :
                    element.removeAttribute(name);

                return true;
            },
            parse = (value) => JSON.parse(value),
            stringify = (value) => JSON.stringify(value),
        } = opt;

        if(value == null) return set(null, () => 'null');

        try {
            const json = typeof value === 'string' ? parse(value) : value;
            const raw = () => stringify(json);

            if(validate(json, raw)) return set(json, raw);
        } 
        catch(error) {
            console.warn(`[Set Json Attribute] ${element.tagName.toLowerCase()}[${name}]`, error);
        }

        return false;
    }
}

export default JsonUtils;