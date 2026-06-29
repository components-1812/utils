import { StyleCollection } from "./StyleCollection.js";

export class ComponentStyleSheets {

    constructor(styles = {}){

        this.adopted = new StyleCollection({
            validator: (value) => {

                return value instanceof CSSStyleSheet;
            }
        });

        this.links = new StyleCollection({
            validator: (value) => {

                return typeof value === 'string' && value.trim().length > 0 && URL.canParse(value, document.baseURI);
            },
            mapper: (value) => {

                return new URL(value, document.baseURI).href;
            }
        });

        this.raw = new StyleCollection({
            validator: (value) => {
            
                return typeof value === 'string'
            }
        });

        this.add(styles);
    }

    add(styles = {}){
        
        const {raw, links, adopted} = styles;
            
        if(links) this.links.add(links);
        if(adopted) this.adopted.add(adopted);
        if(raw) this.raw.add(raw);
 
        return this; 
    }
    
    clear(){
        this.links.clear();
        this.adopted.clear();
        this.raw.clear();

        return this;
    }
}