

export function query(element, selector, opt = {}){

    if(!element || !selector) throw new Error("Element and selector are required to query.");
    
    const {attributes = {}, data = {}, all = false} = opt;

    const q = [selector.trim()];

    if(typeof attributes === 'object' && attributes !== null){
        for(let attr in attributes) {

            const value = String(attributes[attr]);

            q.push(`[${CSS.escape(attr)}="${CSS.escape(value)}"]`);
        }
    }
    
    if(typeof data === 'object' && data !== null){
        for(let dataAttr in data) {

            const value = String(data[dataAttr]);

            q.push(`[data-${CSS.escape(dataAttr)}="${CSS.escape(value)}"]`);
        }
    }

    const queryString = q.join('');
    
    return all ? [...element.querySelectorAll(queryString)] : element.querySelector(queryString);
}