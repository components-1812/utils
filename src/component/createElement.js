

export function createElement(createElementFn = (tagName) => document.createElement(tagName)) {

    return function(tagName, opt = {}) {
    
        const {classes = [], attributes = {}, data, textContent, children = [], html } = opt;
    
        const element = createElementFn(tagName);
    
        //MARK: Classes
        if(Array.isArray(classes)) element.classList.add(...classes);
    
        //MARK: Attributes
        if(typeof attributes === 'object' && attributes !== null) {
            for(let attribute in attributes) {
                element.setAttribute(attribute, attributes[attribute]);
            }
        }
    
        //MARK: Data Attributes
        if(typeof data === 'object' && data !== null) {
            for(let attribute in data) {
                element.setAttribute(`data-${attribute}`, data[attribute]);
            }
        }
    
        //MARK: Text Content
        if(typeof textContent === 'string') element.textContent = textContent;
    
        //MARK: HTML Content
        if(typeof html === 'string') element.innerHTML = html;
    
        //MARK: Children
        if(Array.isArray(children)) {
            for(let child of children) {
                element.append(child);
            }
        }
    
        return element;
    }
}
