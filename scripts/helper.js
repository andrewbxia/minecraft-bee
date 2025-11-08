const minurl = window.location.host; // give them the port if they wanna!!!!
const baseurl = window.location.origin;
const fullurl = baseurl + window.location.pathname;
const siteurls = ["andrewb.xyz", "axia.sh", "axia.nekoweb.org"];
const debug = !siteurls.includes(minurl);
// helper code i wrote to make everything(javascript) either less horrible or more unreadable with the terseness of whatever declaratinons come out of me utilizing this

const eid = (id) => document.getElementById(id);
const eq = (query) => document.querySelector(query);
const eqa = (query) => document.querySelectorAll(query);
const compst = (el) => window.getComputedStyle(el);
const brect = (el) => el.getBoundingClientRect();
const pint = (el, rad = 10) => parseInt(el, rad);
const poat = (el) => parseFloat(el);
const log = (...message) => console.log(...message);
const dlog = (...message) => {if(debug) console.trace(performance.now(), ...message)}; // debug log
const dlert = (...message) => {if(debug) alert(...message)};
const warn = (...message) => console.warn(...message);
const darn = (...message) => {if(debug) warn(...message)}; // lmao im keeping darn no dwarn here
const err = (...message) => console.error(...message);
const derr = (...message) => {if(debug) err(...message)};
const abs = (num) => Math.abs(num);
const pow = (num, exp) => Math.pow(num, exp);
const pi = Math.PI
const deg2rad = pi / 180;
const rad2deg = 180 / pi;
const sin = (rads) => Math.sin(rads);
const cos = (rads) => Math.cos(rads);
const tan = (rads) => Math.tan(rads);
const assert = (condition, msg) => {if(!condition) throw new Error(msg);};
const assertnotreached = (msg = "unreachable thingy reached") => assert(false, msg);

const truheight = window.innerHeight * window.devicePixelRatio;
const truwidth = window.innerWidth * window.devicePixelRatio;
const sp = "&nbsp;";
const nofunc = () => {};

function max(...args){
    if(args.length === 0) return null;
    let max = args[0];
    args[1] = args[1] || 0;
    for(let i = 1; i < args.length; i++){
        if(typeof max !== typeof args[i]) console.warn("types not same");
        max = max > args[i] ? max : args[i];
    }
    return max;
}
function min(...args){
    if(args.length === 0) return null;
    let min = args[0];
    args[1] = args[1] || 0;
    for(let i = 1; i < args.length; i++){
        if(typeof min !== typeof args[i]) console.warn("types not same");
        min = min < args[i] ? min : args[i];
    }
    return min;
}
const clamp = (val, mini = val, maxi = val) => min(max(val, mini), maxi);
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
const chance = (onein = 2) => Math.random() < 1 / onein;

const params = new URLSearchParams(window.location.search);

// based off of https://github.com/stephenmathieson/ordinal-number-suffix
function numsuffix(num, onlysuffix = false){
    const prefix = onlysuffix ? "" : num + "";
    num %= 100
    return prefix + (floor(num / 10) === 1
      ? 'th'
      : (num % 10 === 1
        ? 'st'
        : (num % 10 === 2
          ? 'nd'
          : (num % 10 === 3
            ? 'rd'
            : 'th'))));
}


// dont use except when i go into typescript since event doesnt have code editor striggies
const listen = (event, callback, element = document) => {
    element.addEventListener(event, callback);
    return () => element.removeEventListener(event, callback);
}
function addclicklistener(query, callback){
    document.addEventListener("click", (e) => {
        if(e.target.matches(query)){
            callback(e);
        }
    })
}

let thememode = localStorage.getItem("theme") || "light";
const toggletheme = () => {
    document.documentElement.classList.toggle("dark"); 
    thememode = document.documentElement.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", thememode);
    document.documentElement.setAttribute("data-theme", thememode);
}
// light mode better tho :sunglasses: :sunglasses:
if (thememode === "dark" || window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches){
    // toggle to dark
    toggletheme();
}
localStorage.setItem("theme", thememode);
document.documentElement.setAttribute("data-theme", thememode);

const elprop = (element, property) => poat(compst(element).getPropertyValue(property));
const elpropstr = (element, property) => compst(element).getPropertyValue(property);
const docprop = (property) => elpropstr(document.documentElement, property);
const setprop = (element = document.documentElement, property, value = null) => element.style.setProperty(property, value);

function isnum(num){
    if(typeof num === 'number') {
        return num - num === 0;
    }
    if(typeof num === 'string' && num.trim() !== '') {
        return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
    }
    return false;
}
const nullnum = (num) => isnum(num) ? num : null;
// html elements funcs to make everything terse and unreadable
function mk(type, attr = {}){
    const el = document.createElement(type);
    for(const [key, value] of Object.entries(attr)){
        el.setAttribute(key, value);
    }
    return el;
}
function mktxt(type, txt, attr = {}, explicit = false){ /* explicitly set as inner text */
    if(typeof attr === "boolean"){
        explicit = attr;
        attr = {};
    }
    const el = mk(type, attr);
    if(explicit)
        el.innerText = txt;
    else
        el.innerHTML = txt; // hopefully no one abooses this :(((((
    return el;
}
function mkhtml(type, txt = "", attr = {}) {
    if (typeof txt === "object") {
        return mktxt(type, "", txt).outerHTML;
    }
    return mktxt(type, txt, attr).outerHTML;
}
function checknodes(func, ...nodes){
    let ok = true;
    nodes.forEach((node, idx) => {
        if(!(node instanceof Node)){
            err(`arg ${idx + 1} is not a node`);
            attachdebug(`arg ${idx + 1} is not a node`);
            ok = false;
        }
    });
    if(ok) func(...nodes);
    return ok;
}

function app(parent, child){
    checknodes((p, c) => p.appendChild(c), parent, child);
    return parent;
}
function appmany(parent, children){
    children.forEach(child => app(parent, child));
    return parent;
}

function appnest(...nodes){
    if(!checknodes(nofunc, ...nodes))return null;
    for(let i = nodes.length - 1; i > 0; i--){
        app(nodes[i - 1], nodes[i]);
    }
    return nodes[0];
}

function appdoc(child){
    return app(document.body, child);
}
function prep(parent, child){
    checknodes((p, c) => p.prepend(c), parent, child);
    return parent;
}
function prepmany(parent, children){
    children.forEach(child => prep(parent, child));
    return parent;
}

const fromhtml = (txt) => mktxt("template", txt).content.firstChild;
const tohtml = (el) => el.outerHTML;


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
function nodelist(arr){
    const list = document.createDocumentFragment();
    appmany(list, arr);
    return list;
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

const getstylesheets = () => {
    let str = ``;
    eqa("style").forEach(st => {
        str += st.innerHTML;
    });
    return str;
    // --border variable on my website got overridden since im using 
    // this on my crappy school issued chromebok where there are 
    // literally 9 spyware extensions on this thing, anyways the very very
    // very smart IT people who put stylelint tailwind classes on this
    // did a very good job at overriding my --border variable 
    // ugh
}

const img = (src, attr = {}) => mk("img", {src, ...attr});
const imghtml = (src) => `<img src="${src}" />`;
const p = (txt, attr = {}) => mktxt("p", txt, attr);
const li = (txt) => mktxt("li", txt);


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


// things to do when thing loads or some thing
function imglazy(img){
    if(!img.hasAttribute("loading")){
        img.setAttribute("loading", "lazy");
    }
    return img;
}
document.addEventListener("DOMContentLoaded", () =>{
    eqa("img").forEach(img => {
        if(!img.classList.contains("nl"))
            imglazy(img);
    })
});
    

function attachdebug(...messages){
    if(!debug) return;
    const debugmessage = `debug mode enabled, if you're not me 
        and you see this you can blame my bad coding`;
    
    if(!eid("debug")) {
        if(Debug){
            Debug.init();
            log("ok")
        }
        else{
            return;
        }
    }
    const el = eid("debug");
    el.innerHTML = "";

    app(el, mktxt("h4", debugmessage));
    const list = mk("ul");
    messages.forEach(m => {
        app(list, mktxt("li", m, true));
    });
    app(el, list);
}
