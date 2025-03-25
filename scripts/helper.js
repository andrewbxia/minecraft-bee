const eid = (id) => document.getElementById(id);
const eq = (query) => document.querySelector(query);
const eqa = (query) => document.querySelectorAll(query);
const log = (message) => console.log(message);
const err = (message) => console.error(message);
const abs = (num) => Math.abs(num);
const pow = (num, exp) => Math.pow(num, exp);

function max(a, b){
    if(typeof a !== typeof b) console.warn("types not same");
    return a > b ? a : b;
}
function min(a, b){
    if(typeof a !== typeof b) console.warn("types not same");
    return a < b ? a : b;
}
const floor = (a) => Math.floor(a);
const ceil = (a) => Math.ceil(a);
const rand = (mult = 1, add = 0) => Math.random() * mult + add;
const randint = (mult = 1, add = 0) => Math.floor(Math.random() * (mult + 1)) + add;


const params = new URLSearchParams(window.location.search);
document.addEventListener("DOMContentLoaded", function(){
    eqa("iframe").forEach(iframe => {
        iframe.onload = function() {
            
            // set the height of the iframe as 
            // the height of the iframe content
            try{
                iframe.style.height = iframe.contentWindow.document.body.scrollHeight +'px';
                iframe.contentWindow.document.addEventListener("googies_loaed", () => {
                    iframe.style.height = iframe.contentWindow.document.body.scrollHeight +'px';
                    iframe.parentNode.style.height = iframe.contentWindow.document.body.scrollHeight +'px';
                    // iframe.style.width  = iframe.contentWindow.document.body.scrollWidth + 15 + 'px';
    
                });
            }
            catch(e){
                // err(e);
                err("prob some cross ogigin thing: " +  e.message);
            }
            
            // iframe.style.height = "196px";
            // set the width of the iframe as the 
            // width of the iframe content
            // iframe.style.width  = iframe.contentWindow.document.body.scrollWidth + 15 + 'px';
        }
    });
});

function addclicklistener(query, callback){
    document.addEventListener("click", (e) => {
        if(e.target.matches(query)){
            callback(e);
        }
    })
}

function isnum(num){
    if(typeof num === 'number') {
        return num - num === 0;
    }
    if(typeof num === 'string' && num.trim() !== '') {
        return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
    }
    return false;
}

// html elements funcs to make everything terse and unreadable
function mk(type, attr = {}){
    const el = document.createElement(type);
    for(const [key, value] of Object.entries(attr)){
        el.setAttribute(key, value);
    }
    return el;
}
function mktxt(type, txt, attr = {}){
    const el = mk(type, attr);
    el.innerHTML = txt; // hopefully no one abooses this :(((((
    return el;
}
function mkhtml(type, txt = "", attr = {}) {
    if (typeof txt === "object") {
        return mktxt(type, "", txt).outerHTML;
    }
    return mktxt(type, txt, attr).outerHTML;
}
function app(parent, child){
    if (child instanceof Node) {
        parent.appendChild(child);
    } else {
        err("arg 2 is not an object");
    }
    return parent;
}
const fromhtml = (txt) => mktxt("template", txt).content.firstChild;
const tohtml = (el) => app(mk("template"), el.cloneNode(true)).innerHTML;

function link(url, txt = "", target = "_blank", attr = {}){
    if(typeof target === "object"){
        attr = target;
        target = "_blank";
    }
    return mktxt("a", txt, {href: url, target: target, ...attr});
};
function linkhtml(url, txt = "", target = "_blank", attr = {}){
    if(typeof target === "object"){
        attr = target;
        target = "_blank";
    }
    return mkhtml("a", txt, {href: url, target: target, ...attr});;
}

const img = (src) => mk("img", {src});
const imghtml = (src) => `<img src="${src}" />`;
const p = (txt) => mktxt("p", txt);
const li = (el) => app(mk("li"), el);

class MeteredTrigger{
    #curr = 0;
    #limit = 100;
    #callback = () => new Error("not set yet noobb");

    constructor(limit, callback){
        this.#limit = limit;
        this.#callback = callback;
        this.#curr = performance.now() - this.#limit;
    }

    fire(...args){
        const now = performance.now();
        if(now - this.#curr > this.#limit){
            console.log("fired");
            this.#callback(...args);
            this.#curr = now;
        }
    }
}

// header & footer templates
function component(html, attr = {}) {
    return html.replace(/{{(.*?)}}/g, (match, key) => {
        return key in attr ? attr[key] : match;
    });
}
const header = component(``, {});
const footer = component(``, {});

function putheader(){
    document.body.insertAdjacentHTML("afterbegin", header);
    // any scripts that need to be run insert script elements here
}
function putfooter(){
    document.body.insertAdjacentHTML("beforeend", footer);
}
