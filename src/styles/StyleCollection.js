

export class StyleCollection {

    #set = new Set();
    #validator;
    #mapper;

    constructor(params = {}) {
        const {
            validator = () => true,
            mapper = (value) => value
        } = params;

        this.#validator = validator;
        this.#mapper = mapper;
    }

    add(...values){

        const items = (Array.isArray(values[0]) || values[0] instanceof Set || values[0] instanceof StyleCollection) ? values[0] : values;

        for(const value of items){

            if(this.#validator(value)) this.#set.add( this.#mapper(value) );
        }

        return this;
    }

    clear(){
        this.#set.clear();
        return this;
    }

    get size(){ 
        return this.#set.size;
    }

    has(value){ 
        return this.#set.has(value); 
    }

    toArray(){ 
        return [...this.#set]; 
    }

    [Symbol.iterator](){ 
        return this.#set.values(); 
    }
}