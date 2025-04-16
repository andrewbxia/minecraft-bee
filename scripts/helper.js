const eid = (id) => document.getElementById(id);
const eq = (query) => document.querySelector(query);
const eqa = (query) => document.querySelectorAll(query);
const compst = (el) => window.getComputedStyle(el);
const brect = (el) => el.getBoundingClientRect();
const pint = (el, rad = 10) => parseInt(el, rad);
const poat = (el) => parseFloat(el);
const log = (...message) =>   console.log(...message);
const err = (...message) => console.error(...message);
const abs = (num) => Math.abs(num);
const pow = (num, exp) => Math.pow(num, exp);
const assert = (condition, msg) => {if(!condition) throw new Error(msg);};
const assertnotreached = (msg = "unreachable thingy reached") => assert(false, msg);


function max(...args){
    if(args.length === 0) return null;
    let max = args[0];
    for(let i = 1; i < args.length; i++){
        if(typeof max !== typeof args[i]) console.warn("types not same");
        max = max > args[i] ? max : args[i];
    }
    return max;
}
function min(...args){
    if(args.length === 0) return null;
    let min = args[0];
    for(let i = 1; i < args.length; i++){
        if(typeof min !== typeof args[i]) console.warn("types not same");
        min = min < args[i] ? min : args[i];
    }
    return min;
}
const floor = (a) => Math.floor(a);
const ceil = (a) => Math.ceil(a);
const sqrt = (a) => Math.sqrt(a);
const round = (a) => Math.round(a);
const rand = (mult = 1, add = 0) => Math.random() * mult + add;
const randint = (mult = 1, add = 0) => Math.floor(Math.random() * (mult + 1)) + add;
const randarridx = arr => Math.floor(Math.random() * arr.length);
const randarrchoose = arr => arr[randarridx(arr)];
function extrrand(max) { // prefer extremes of distribution
    const random = rand();
    const bias = random < 0.5 ? pow(random, 2) : 1 - pow(1 - random, 2);
    return bias * max;
}
const params = new URLSearchParams(window.location.search);
document.addEventListener("DOMContentLoaded", function(){
    eqa("iframe").forEach(iframe => {
        iframe.onload = () => {
            // set the height of the iframe as 
            // the height of the iframe content
            try{
                iframe.style.height = iframe.contentWindow.document.body.scrollHeight +'px';
                iframe.contentWindow.document.addEventListener("googies_loaed", () => {
                    iframe.style.height = iframe.contentWindow.document.body.scrollHeight +'px';
                    iframe.parentNode.style.height = iframe.contentWindow.document.body.scrollHeight +'px';
                    // iframe.style.width  = iframe.contentWindow.document.body.scrollWidth + 15 + 'px';
    
                });
                log("ok good");
                log(iframe.style.height);
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
function nullnum(num){
    if(isnum(num))
        return num;
    return null;
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
function appmany(parent, children){
    children.forEach(child => app(parent, child));
    return parent;
}
const fromhtml = (txt) => mktxt("div", txt).content.firstChild;
const tohtml = (el) => app(mk("div"), el.cloneNode(true)).innerHTML;

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

const script = (src, defer = true, async = true) => {
    const sc = mk("script", {src, defer, async});
    app(document.head, sc);
    return sc;
}
const scripting = (src) => {
    const sc = mktxt("script", src);
    app(document.head, sc);
    return sc;
}
const style = (src) => {
    const sty = mk("link", {rel: "stylesheet", href: src});
    app(document.head, sty);
    return sty;
}

const styling = (sty) => {
    const st = mktxt("style", sty);
    app(document.head, st);
    return st;
}
const img = (src) => mk("img", {src});
const imghtml = (src) => `<img src="${src}" />`;
const p = (txt) => mktxt("p", txt);
const li = (el) => app(mk("li"), el);


// header & footer templates
const component = (html, attr = {}) => 
    html.replace(/{{(.*?)}}/g, (match, key) => {
        return key in attr ? attr[key] : match;});

const header = component(``, {});
const footer = component(``, {});

function putheader(){
    document.body.insertAdjacentHTML("afterbegin", header);
    // any scripts that need to be run insert script elements here
}
function putfooter(){
    document.body.insertAdjacentHTML("beforeend", footer);
}

