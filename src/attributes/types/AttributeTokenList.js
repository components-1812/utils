//MARK: CustomTokenList
export class CustomTokenList {



    #tokens;

    constructor(value, opt = {}){

        const { 
            clean = true,
            separator = /\s+/,
            charsToRemove = [',', '.', ';', ':'],
            validate = () => true 
        } = opt;

        this.validate = validate;
        this.clean = clean;
        this.separator = separator;
        this.charsToRemove = charsToRemove;

        this.#tokens = this.parseTokens(value);
    }

    parseTokens(value, opt = {}){

        if(value == null) return new Set();

        const { 
            clean = this.clean,
            separator = this.separator,
        } = opt;

        let values;

        if(typeof value === 'string') values = value.split(separator);
        if(Array.isArray(value) || value instanceof Set) values = value;

        const tokens = new Set();

        if(values != null){
            for(let token of values){
                
                token = this.cleanToken(token, clean);

                if(token === '') continue;
                if(typeof this.validate === 'function' && !this.validate(token)) continue;

                tokens.add(token);
            }
        }

        return tokens;
    }

    cleanToken(token, clean = this.clean){

        if(token == null) return '';
        if(typeof token !== 'string') return '';

        if(clean) {

            let cleaned = token.trim();

            for(let char of this.charsToRemove) cleaned = cleaned.replaceAll(char, '');

            token = cleaned;
        }

        return token;
    }

    hasToken(token, clean = this.clean) {
        
        token = this.cleanToken(token, clean);
        
        return this.#tokens.has(token);
    }
    addToken(token, clean = this.clean){

        token = this.cleanToken(token, clean);
        if(token === '') return false;

        if(typeof this.validate === 'function' && !this.validate(token)) return false;

        this.#tokens.add(token);

        return this.#tokens.has(token);
    }
    removeToken(token, clean = this.clean){

        token = this.cleanToken(token, clean);
        if(token === '') return false;

        this.#tokens.delete(token);

        return this.#tokens.has(token);
    }
    toggleToken(token, clean = this.clean){

        token = this.cleanToken(token, clean);
        if(token === '') return false;

        if(typeof this.validate === 'function' && !this.validate(token)) return false;

        this.#tokens.has(token) ? this.#tokens.delete(token) : this.#tokens.add(token);

        return this.#tokens.has(token);
    }
    replaceToken(oldToken, newToken, clean = this.clean){

        oldToken = this.cleanToken(oldToken, clean);
        newToken = this.cleanToken(newToken, clean);
        if(oldToken === '' || newToken === '') return false;

        if(typeof this.validate === 'function' && !this.validate(newToken)) return false;

        if(!this.#tokens.has(oldToken)) return false;

        const tokens = this.toArray();
        const index = tokens.indexOf(oldToken);

        if(index !== -1) {
            tokens[index] = newToken;
            this.#tokens = new Set(tokens);
            return true;
        }

        return false;
    }

    get length(){ 
        return this.#tokens.size; 
    }
    toArray(){
        return [...this.#tokens];
    }
    toSet(){
        return new Set(this.#tokens);
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
    toString(){
        return this.toArray().join(' ');
    }
    [Symbol.iterator]() {
        return this.#tokens.values();
    }
}

//MARK: AttributeTokenList
export class AttributeTokenList {

    static cache = null;

    static getIntance(element, attribute, opt = {}){
        if(!element || !attribute) throw new Error("Element and attribute are required to get an attribute token list");

        this.cache ??= new WeakMap();

        const vault = this.cache.get(element) ?? this.cache.set(element, new Map()).get(element);

        const list = vault.get(attribute) ?? vault.set(attribute, new AttributeTokenList(element, attribute, opt)).get(attribute);

        return list;
    }

    #element;
    #attribute;
    #supportedTokens;
    
    constructor(element, attribute, opt = {}) {

        const {
            supportedTokens = [], 
        } = opt;

        this.#element = element;
        this.#attribute = attribute;

        this.#supportedTokens = new CustomTokenList(supportedTokens);

        return new Proxy(this, {
            get(target, prop, receiver) {
                
                const i = parseInt(prop);
                
                if(Number.isInteger(i)) return target.item(i);
                
                const value = Reflect.get(target, prop, receiver);

                if (typeof value === "function") {
                    return value.bind(target);
                }

                return value;
            }
        });
    }

    _getAttributeValue(){
        return this.#element.getAttribute(this.#attribute);
    }

    _setAttributeValue(value){
        this.#element.setAttribute(this.#attribute, value);
    }

    
    get element(){
        return this.#element;
    }
    get attribute(){
        return this.#attribute;
    }
    get supportedTokens(){
        return this.#supportedTokens.toSet(); 
    }
    get tokens(){
        return new CustomTokenList(this._getAttributeValue(), { 
            validate: (token) => this.supports(token) 
        });
    }
    
    
    //MARK: DOMTokenList properties and methods

    //properties
    get length(){
        return this.tokens.length;
    }
    get value(){
        return this.tokens.toString();
    }
    set value(val){
        const tokens = new CustomTokenList(val, { 
            validate: (token) => this.supports(token) 
        });
        this._setAttributeValue(tokens.toString());
    }

    //methods
    add(...tokens){

        const list = this.tokens;
        const prevSize = list.length;

        for(let token of tokens){

            list.addToken(token);
        }

        if(prevSize !== list.length) this._setAttributeValue(list.toString());
    }

    remove(...tokens){

        const list = this.tokens;
        const prevSize = list.length;

        for(let token of tokens){

            list.removeToken(token);
        }

        if(prevSize !== list.length) this._setAttributeValue(list.toString());
    }

    replace(oldToken, newToken){

        const list = this.tokens;
        const replaced = list.replaceToken(oldToken, newToken);

        if(replaced) this._setAttributeValue(list.toString());

        return replaced;
    }

    toggle(token, force = null){
        
        const list = this.tokens;
        let result;

        if(force == null) {
            result = list.toggleToken(token);
        }
        else {
            result = force ? list.addToken(token) : list.removeToken(token);
        }

        this._setAttributeValue(list.toString());

        return result;
    }

    contains(token){

        return this.tokens.hasToken(token);
    }

    item(index){
        return this.tokens.toArray().at(index);
    }
    
    values(){
        return this.tokens.values();
    }
    keys(){
        return this.tokens.keys();
    }
    entries(){
        return this.tokens.entries();
    }

    supports(token){

        if(token == null) return false;
        if(typeof token !== 'string') return false;

        token = token.trim();
        if(token === '') return false;

        if(!this.#supportedTokens || this.#supportedTokens.length === 0) return true;

        return this.#supportedTokens.hasToken(token);
    }

    forEach(callback, thisArg){

        if(typeof callback !== 'function') return;

        let index = 0;

        for(const token of this.tokens){

            callback.call(thisArg, token, index, this);
            index++;
        }
    }

    toString(){
        return this.value;
    } 

    [Symbol.iterator]() {
        return this.tokens[Symbol.iterator]();
    }
}


export const AttributeTokenListUtils = {
    AttributeTokenList,
    CustomTokenList,
    
    get(element, attribute, opt = {}){

        return AttributeTokenList.getIntance(element, attribute, opt);
    }
}

export default AttributeTokenListUtils;