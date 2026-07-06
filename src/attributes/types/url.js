

const UrlUtils = {

    get(element, name, defaultValue = null, opt = {}) {

        if(!element || !name) console.warn(`[Get Url Attribute] element or attribute name are required.`);
        
        let value = element.getAttribute(name);

        if(value == null) return defaultValue;

        const { 
            validate = () => true,
            baseUrl = document.baseURI,
        } = opt;

        try {

            const url = new URL(value, baseUrl);

            if(validate(url)) return url;
        }
        catch(error) {
            console.warn(`[Get Url Attribute] ${element.tagName.toLowerCase()}[${name}]`, error);
        }

        return defaultValue;
    },
    
    set(element, name, value, opt = {}) {

        if(!element || !name) console.warn(`[Set Url Attribute] element or attribute name are required.`);

        if(value == null) {
            element.removeAttribute(name);
            return;
        }
        
        const { 
            validate = () => true,
            baseUrl = document.baseURI,
        } = opt;
        
        try {
            const url = new URL(value, baseUrl);
            
            if(validate(url)) {
                element.setAttribute(name, url.toString());
                return true;
            }
        }
        catch(error) {
            console.warn(`[Set Url Attribute] ${element.tagName.toLowerCase()}[${name}]`, error);
        }
        
        return false;
    }
}