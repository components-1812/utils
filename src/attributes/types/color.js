

export class Color {

    static canvas = null;
    static ctx = null;

    static getChannels(value){
        
        if (!Color.canvas) {
            Color.canvas = document.createElement("canvas");
            Color.canvas.width = 1;
            Color.canvas.height = 1;
            Color.ctx = Color.canvas.getContext('2d', { willReadFrequently: true });
        }

        if (!Color.ctx) {
            throw new Error("Could not create canvas 2D context.");
        }

        Color.ctx.clearRect(0, 0, 1, 1);
        Color.ctx.fillStyle = value;
        Color.ctx.fillRect(0, 0, 1, 1);

        const [r, g, b, a] = Color.ctx.getImageData(0, 0, 1, 1).data;
        const alpha = Number((a / 255).toFixed(2));

        return { r, g, b, a, alpha };
    }

    static channelsToHsl(channels){
        
        let [r, g, b] = channels;

        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;

        let h = 0;
        let s = 0;
        const l = (max + min) / 2;

        if (delta !== 0) {
            s = delta / (1 - Math.abs(2 * l - 1));

            switch (max) {
                case r:
                    h = ((g - b) / delta) % 6;
                    break;

                case g:
                    h = (b - r) / delta + 2;
                    break;

                case b:
                    h = (r - g) / delta + 4;
                    break;
            }

            h *= 60;

            if(h < 0) h += 360;
        }

        return {
            h: Math.round(h),
            s: Number((s * 100).toFixed(2)),
            l: Number((l * 100).toFixed(2)),
        };
    }

    #r;
    #g;
    #b;
    #a;
    #alpha;
    #value;

    constructor(value){
        
        if(!CSS.supports("color", value))
            throw new Error(`Invalid color value: "${value}". It must be a valid CSS color.`);

        const { r, g, b, a, alpha } = Color.getChannels(value);

        this.#value = value;
        this.#r = r;
        this.#g = g;
        this.#b = b;
        this.#a = a;
        this.#alpha = alpha;
    }

    toHex(opt = {}){

        const { alpha = this.#a < 255 } = opt;

        const hex = [this.#r, this.#g, this.#b]

        if(this.#a < 255 && alpha) hex.push(this.#a);

        for (let i = 0; i < hex.length; i++) {

            hex[i] = hex[i].toString(16).padStart(2, '0');
        }

        return '#' + hex.join('');
    }
    toRgb(opt = {}){

        const { legacy = false, alpha = this.#a < 255 } = opt;

        if(legacy){

            return alpha 
                ? `rgba(${this.#r}, ${this.#g}, ${this.#b}, ${this.#alpha})`
                : `rgb(${this.#r}, ${this.#g}, ${this.#b})`;
        }
        else{
            //CSS Level 4 Syntax 
            return alpha
                ? `rgb(${this.#r} ${this.#g} ${this.#b} / ${this.#alpha})`
                : `rgb(${this.#r} ${this.#g} ${this.#b})`;
        }
    }

    toHsl(opt = {}){

        const { legacy = false, alpha = this.#a < 255 } = opt;

        const { h, s, l } = Color.channelsToHsl([this.#r, this.#g, this.#b, this.#a]);

        if(legacy){

            return alpha 
                ? `hsla(${h}, ${s}%, ${l}%, ${this.#alpha})`
                : `hsl(${h}, ${s}%, ${l}%)`;
        }
        else{
            //CSS Level 4 Syntax 
            return alpha
                ? `hsl(${h} ${s}% ${l}% / ${this.#alpha})`
                : `hsl(${h} ${s}% ${l}%)`;
        }
    }


    get hex(){
        return this.toHex();
    }
    get rgb(){
        return this.toRgb();
    }
    get hsl(){
        return this.toHsl();
    }

    get alpha(){ 
        return this.#alpha; 
    }
    get value(){ 
        return this.#value; 
    }
    get channels(){
     
        return new Proxy([this.#r, this.#g, this.#b, this.#a], {
            
            get(target, property){
                
                switch(property){
                    
                    case 'r': return target[0];
                    case 'g': return target[1];
                    case 'b': return target[2];
                    case 'a': return target[3];

                    default: return Reflect.get(target, property);
                }
            }
        });
    }
}


export const ColorUtils = {

    Color,

    parseColor(value){
        
        return new Color(value);
    },

    get(element, name, defaultValue, opt = {}) {

        const value = element.getAttribute(name);

        if (value == null) return defaultValue;

        const {
            validate = () => true
        } = opt;

        try {
            const color = ColorUtils.parseColor(value);

            if (validate(color)) return color;
        }
        catch (error) {

            console.warn(`[Color Exception] ${element.tagName.toLowerCase()}[${name}]`, error);
        }

        return defaultValue;
    },

    set(element, name, value, opt = {}) {

        const {
            validate = () => true
        } = opt;

        try {
            const color = ColorUtils.parseColor(value);

            if(validate(color)){
                
                element.setAttribute(name, value);
                return true;
            }
        }
        catch (error) {

            console.warn(`[Color Exception] ${element.tagName.toLowerCase()}[${name}]`, error);
        }

        return false;
    }
}

export default ColorUtils;