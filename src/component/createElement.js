

export function createElement(createElementFn = (tagName) => document.createElement(tagName)) {

    return function(tagName, opt = {}) {
    
        const {classes = [], attributes = {}, data, textContent, children = [], html } = opt;
    
        const element = createElementFn(tagName);
    
        //MARK: Classes
        if(Array.isArray(classes)) {

            const filtered = classes.filter(cls => typeof cls === 'string');

            if(filtered.length) element.classList.add(...filtered);
        }
    
        //MARK: Attributes
        if(typeof attributes === 'object' && attributes !== null) {

            for(let attribute in attributes) {

                const value = attributes[attribute];

                if(value != null) element.setAttribute(attribute, String(value));
            }
        }
    
        //MARK: Data Attributes
        if(typeof data === 'object' && data !== null) {

            for(let attribute in data) {

                const value = data[attribute];

                if(value != null) element.setAttribute(`data-${attribute}`, String(value));
            }
        }
    
        //MARK: Text Content
        if(typeof textContent === 'string') element.textContent = textContent;
    
        //MARK: HTML Content
        if(typeof html === 'string') element.innerHTML = html;
    
        //MARK: Children
        if(Array.isArray(children)) {

            for(let child of children) {

                if(child instanceof Node) element.append(child);
            }
        }
    
        return element;
    }
}
