import { ComponentStyleSheets } from "./ComponentStyleSheets.js";

export class ComponentStyles extends ComponentStyleSheets {

    #element;

    constructor(element, styles = {}){
        super(styles);
     
        this.#element = element;
    }

    apply(){

        this.#element.removeAttribute('ready-links');

        const styles = document.createElement('div');
        styles.classList.add('styles');
        styles.style.display = 'none';

        const promises = [];

        //Render links
        for(const url of this.links) {

            const {promise, reject, resolve} = Promise.withResolvers();

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;

            //If it's already loaded (rare in shadow DOM, but possible)
            if(link.sheet){
                resolve({ link, href: url, status: 'loaded' });
            }
            else {
                link.addEventListener('load', () => resolve({ link, href: url, status: 'loaded' }));
                link.addEventListener('error', () => reject({ link, href: url, status: 'error' }));
            }

            styles.append(link);
            promises.push(promise);
        }

        //External css files loaded
        Promise.allSettled(promises).then((results) => {

            this.#element.dispatchEvent(
                new CustomEvent('ready-links', {
                    detail: { 
                        results: results.map((r) => r.value || r.reason) 
                    },
                })
            );

            this.#element.setAttribute('ready-links', '');
        });

        //Render raw
        for(const raw of this.raw) {

            const style = document.createElement('style');
            style.textContent = raw;

            styles.append(style);
        }

        //Clear previous styles
        this.#element.shadowRoot.querySelector('.styles')?.remove();

        //Add new styles
        this.#element.shadowRoot.prepend(styles);

        //Set Adopted Styles Sheets
        this.#element.shadowRoot.adoptedStyleSheets = this.adopted.toArray();

        return this;
    }
}
