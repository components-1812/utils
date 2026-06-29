

export class CustomTokenList {

    #element;
    #attribute;
    #supportedTokens;
    #tokens;

    constructor(element, attribute, opt = {}) {

        const {
            supportedTokens = [], 
            cleanTokens = true
        } = opt;

        this.#element = element;
        this.#attribute = attribute;
        this._cleanTokens = cleanTokens;

        this.#supportedTokens = this._parseTokens(supportedTokens, {checkSupport: false});
        this.#tokens = this._parseTokens(this._getAttributeValue());
    }

    _getAttributeValue(){
        return this.#element.getAttribute(this.#attribute);
    }

    _setAttributeValue(value){
        this.#element.setAttribute(this.#attribute, value);
    }

    _parseTokens(value, opt = {}){

        if(value == null) return new Set();

        const { 
            cleanTokens = this._cleanTokens,
            separator = /\s+/,
            checkSupport = true,
        } = opt;

        let values;

        if(typeof value === 'string') values = value.split(separator);
        if(Array.isArray(value) || value instanceof Set) values = value;

        const tokens = new Set();

        if(values != null){
            for(let token of values){
                
                token = this._cleanToken(token, cleanTokens);

                if(checkSupport && !this.supports(token)) continue;

                tokens.add(token);
            }
        }

        return tokens;
    }

    _cleanToken(token, clean = this._cleanTokens){

        if(token == null) return '';
        if(typeof token !== 'string') return '';

        if(clean) token = token.trim().replaceAll(/,/g, '');

        return token;
    }

    get _supportedTokens(){ 
        return new Set(this.#supportedTokens); 
    }
    get _tokens(){ 
        return new Set(this.#tokens); 
    }
    get _element(){
        return this.#element;
    }
    get _attribute(){
        return this.#attribute;
    }
    
    
    //MARK: DOMTokenList properties and methods

    //properties
    get length(){
        return this.#tokens.size;
    }

    get value(){
        return [...this.#tokens].join(' ');
    }

    //methods
    add(...tokens){

        let modified = false;

        for(let token of tokens){

            token = this._cleanToken(token);

            if(!this.supports(token) || this.contains(token)) continue;

            this.#tokens.add(token);
            modified = true;
        }

        if(modified) this._setAttributeValue(this.value);
    }

    remove(...tokens){

        let modified = false;

        for(let token of tokens){

            token = this._cleanToken(token);

            if(!this.supports(token) || !this.contains(token)) continue;
       
            this.#tokens.delete(token);
            modified = true;
        }

        if(modified) this._setAttributeValue(this.value);
    }

    toggle(token, force = null){
        
        token = this._cleanToken(token);

        if(!this.supports(token)) return;

        if(force == null) {
            this.contains(token) ? this.#tokens.delete(token) : this.#tokens.add(token);
        }
        else {
            force ? this.#tokens.add(token) : this.#tokens.delete(token);
        }

        this._setAttributeValue(this.value);

        return this.contains(token);
    }

    contains(token){

        token = this._cleanToken(token);

        if(!this.supports(token)) return false;
        
        return this.#tokens.has(token);
    }

    item(index){
        return [...this.#tokens][index];
    }
    
    values(){
        return this.#tokens.values();
    }

    keys(){
        return this.#tokens.keys();
    }

    entries(){
        return this.#tokens.entries();
    }

    supports(token){

        if(token == null) return false;
        if(typeof token !== 'string') return false;

        token = this._cleanToken(token);

        if(token === '') return false;

        if(!this.#supportedTokens || this.#supportedTokens.size === 0) return true;

        return this.#supportedTokens.has(token);
    }

    forEach(callback, thisArg){
        this.#tokens.forEach((token) => callback.call(thisArg, token));
    }

    toString(){
        return this.value;
    }

    [Symbol.iterator]() {
        return this.#tokens.values();
    }
}



export function getListAttribute(element, attribute, opt = {}){

    const {
        cleanTokens = true,
        supportedTokens = []
    } = opt;

    return new CustomTokenList(element, attribute, { cleanTokens, supportedTokens });
}