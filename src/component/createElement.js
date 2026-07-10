

export function createElement(createElementFn = (tagName) => document.createElement(tagName)) {

    return function(tagName, opt = {}) {
    
        const {classes = [], attributes = {}, styles = {}, data, textContent, children = [], html } = opt;
    
        const element = createElementFn(tagName);
    
        //MARK: Styles
        if(typeof styles === 'object' && styles !== null) {

            for(let [style, value] of Object.entries(styles)) {

                if(value != null) element.style.setProperty(style, String(value));
            }
        }
    
        //MARK: Classes
        if(Array.isArray(classes)) {

            const filtered = classes.filter(cls => typeof cls === 'string');

            if(filtered.length) element.classList.add(...filtered);
        }
    
        //MARK: Attributes
        if(typeof attributes === 'object' && attributes !== null) {

            for(let [attribute, value] of Object.entries(attributes)) {

                if(value != null) element.setAttribute(attribute, String(value));
            }
        }
    
        //MARK: Data Attributes
        if(typeof data === 'object' && data !== null) {

            for(let [attribute, value] of Object.entries(data)) {

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
