// set of classes i made to help me not go crazy with tihs coding
class MeteredTrigger{
    #curr = 0;
    #limit = 100;
    #callback = () => {};
    #log = false;

    constructor(limit, callback = () => {throw new Error("not set yet noobb")}, log = false){
        this.#limit = limit;
        this.#callback = callback;
        this.#curr = performance.now() - this.#limit;
        this.#log = log;
    }

    fire(...args){
        const now = performance.now();
        if(now - this.#curr >= this.#limit){ // >= to let firing immediately after creation
            if(this.#log) console.log("fired");
            this.#callback(...args);
            this.#curr = now;
        }
    }

    setlimit(limit){
        this.#limit = limit;
    }
}

class PerSec{
    #q = [];
    #windowdefualt = 1000;
    #window = this.#windowdefualt;

    constructor(window = 1000){
        this.#q = [];
        this.#window = window;
    }

    shift(){
        while(this.#q.length > 0 && performance.now() - this.#q.at(0) > this.#window){
            this.#q.shift();
        }
    }

    setwindow(window){
        this.#window = window;
    }

    cnt(){
        this.shift();
        return this.#q.length;
    }

    add(countbefore = false){
        this.#q.push(performance.now());
        return this.cnt() - countbefore;
    }

    cntn(){
        return this.cnt() * this.#windowdefualt / this.#window;
    }

    getq(){
        return this.#q;
    }
}


class MeteredPatientTrigger{
    #lastfire = -1;
    #lastattempt = -1;
    #limit = 100;
    #callback = () => new Error("not set yet noobb");
    #trigger = setTimeout(() => {}, 0);
    #log = false;

    constructor(limit, callback, log = false){
        this.#limit = limit;
        this.#callback = callback;
        this.#lastfire = 0;
        this.#log = log;
    }

    fire(...args){
        const now = performance.now();
        if(this.#lastattempt + this.#limit <= now){
            if(this.#log) console.log("fired");
            this.#callback(...args);
            this.#lastfire = this.#lastattempt;
        }
        else{
            if(this.#trigger) clearTimeout(this.#trigger);
            this.#trigger = setTimeout(() => {
                this.fire(...args);
            }, this.#limit);

        }
        this.#lastattempt = now;

    }

    getrecent(){
        return this.#lastattempt;
    }

    getrecentfire(){
        return this.#lastfire;
    }
}

class MeteredQueueTrigger{
    #lastfire = 0;
    #limit = 100;
    #callback = () => new Error("not set yet noobb");
    #trigger = setTimeout(() => {}, 0);
    #log = false;
    #queued = false;

    constructor(limit, callback, log = false){
        this.#limit = limit;
        this.#callback = callback;
        this.#log = log;
    }

    fire(...args){
        const diff = performance.now() - this.#lastfire;
        if(diff >= this.#limit){
            if(this.#log) console.warn("fired");
            this.#callback(...args);
            this.#lastfire = performance.now();
            this.#queued = false;
        }
        else{
            if(!this.#queued){
                this.#trigger = setTimeout(() => {
                    this.fire(...args);
                }, this.#limit - diff);
            }
            this.#queued = true;
        }
    }

    getrecent(){
        return this.#lastfire;
    }

}


class RollingAvg{
    #q = [];
    #sum = 0;
    #defaultcnt = 3;
    #cnt = this.#defaultcnt;

    get(){
        return this.#sum / Math.max(1, this.#q.length);
    }

    #shift(){
        while(this.#q.length > this.#cnt){
            this.#sum -= this.#q.shift();
        }
    }

    add(val){
        this.#q.push(val);
        this.#sum += val;
        this.#shift();
        return this.get();
    }

    setcnt(ncnt = this.#defaultcnt){
        if(ncnt < 1) console.warn("cnt should be like 1 or something");
        this.#cnt = ncnt;
        this.#shift();
    }

    constructor(cnt = this.#defaultcnt, preset = []){
        this.setcnt(cnt);
        for(let i = Math.max(0, preset.length - this.#cnt); i < preset.length; i++){
            this.add(preset[i]);
        }
    }
}


// class MeteredDelayTrigger extends MeteredTrigger{
//     fire(...args){
//         this.#q.shift();
//         log(performance.now());log(this.#q.getq())
//         if(this.#q.getq().length === 0){
//             this.#callback(...args);
//         }
//         else{
//             /*
//             this.#next = this.#next.then(() => new Promise((resolve) => {
//                     action();
//                     setTimeout(() => {
//                         resolve();
//                     }, duration);
//                 }));
            
//             */
//             const timeleft = this.#q.getq().at(-1) + this.#limit - performance.now() +1;
//             if(this.#trigger) clearTimeout(this.#trigger);
//             this.#trigger = setTimeout(() => {
//                 this.fire(...args);
//             }, this.#limit);

//         }
//     }
// }

// requires some methods from helper.js
class RollingActives{
    len = axiatxt.length;
    #classpre = "";
    #active = "";
    axia = axia;
    axiac = axia.childNodes;
    #activeq = Array(this.len).fill(0); /* keep track of cells currently active */
    #cnt = 0;
    #forcedreset = false;
    #decay = 100;
    #initialized = false;

    constructor(el, activeclass = "active", classprefix = "*"){ // maybe do class prefix later im lazy
        this.#init();
        assert(el instanceof HTMLElement, "el is not a html element");
        this.axiac = el.childNodes;
        this.len = el.childNodes.length;
        // issues where helper.js is not loaded yet
        if(this.len === 0) warn("el gott like no children bruh");
        assert(typeof classprefix === "string" && classprefix.length > 0, "classprefix must be a nonempty string");
        assert(typeof activeclass === "string" && activeclass.length > 0, "activeclass must be a nonempty string");
        this.#classpre = classprefix;
        this.#active = activeclass;
    }

    #genid(){
        return ++this.#cnt;
    }

    #schedulereset(totaldelay = 0, idcheck = Infinity){
        setTimeout(() => {
            if(idcheck < this.#cnt)return;
            this.reset(true);
        }, totaldelay);
    }

    reset(indices = [], force = false){
        if(typeof indices === "boolean"){
            force = indices;
            indices = [];
        }
        if(force){
            this.#forcedreset = true; // activeq can possible go into the negatives
            this.axiac.forEach(e => {
                e.classList.remove(this.#active);
            });
            this.#activeq.forEach(q => q = 0);
        }
        else{
            indices.forEach(idx => {
                this.#activeq[idx]--;
                assert(this.#activeq[idx] >= 0 || this.#forcedreset, "activeq negative?");
                if(this.#activeq[idx] == 0){
                    this.axiac[idx].classList.remove(this.#active);
                    this.#activeq[idx] = 0;
                }
            });            
        }
    }

    set(arr = [], delay = 0, duration = 0, decay = this.#decay){
        if(arr.length === 0) return;
        setTimeout(() => {
            this.reset();
            arr.forEach(idx => {
                this.axiac[idx].classList.add(this.#active);
                this.#activeq[idx]++;
                // log(this.#activeq);
            });
        }, delay);
        setTimeout(() => {
            this.reset(arr);
        }, delay + duration + decay);
    }

    #init(){}


    pass({reverse = randint(1), nucleationsites = randint(floor(this.len / 2) - 1, 1), 
        step = randint(floor(this.len / max(1, nucleationsites - 1)) - 1, 1), delay = randint(150, 350) / 2, 
        start = -1, end = this.len, decay = this.#decay} = {}) {
        const id = this.#genid();
        let totaldelay = 0;
        end = min(end, this.len);
        const maxstart = end - (nucleationsites - 1) * step;
        const rev = reverse ? -1 : 1;
        let omg = false;
        let prevstart = start;
        if(start === -1)
            start = randint(maxstart);
        else{
            start = clamp(start, 0, maxstart);
            if(reverse) start = end - start - 1;
        }

        for (let i = reverse ? end - start - 1 : start; 
            reverse ? i >= 0 : i < end; i += rev) {

            let idx = i;
            const indices = [];
            while (idx >= 0 && idx < this.len && indices.length < nucleationsites) {
                indices.push(idx);
                idx += step * rev;
            }

            this.set(indices, totaldelay, delay, decay);
            totaldelay += delay;
        }

        return totaldelay;
    }
}

class WeightedChoices{
    #weights = [];
    #choices = [];

    add(choice, weight = 1){
        if(weight < 0) throw new Error("weight(s) cannot be negative");
        this.#choices.push(choice);
        this.#weights.push(weight + (this.#weights.at(-1) || 0));
    }

    constructor(choices, weights){
        if(weights === undefined){
            if(choices[0] instanceof Array && choices[0].length === 2){
                weights = choices.map(c => c[1]);
                choices = choices.map(c => c[0]);
            }
            else{
                weights = Array(choices.length).fill(1);
                choices = choices;
            }
        }
        for(let i = 0; i < choices.length; i++){
            this.add(choices[i], weights[i]);
        }
    }

    choose(){
        if(this.#weights.length === 0) return null;
        const rand = Math.random() * this.#weights.at(-1);
        let l = 0, r = this.#weights.length - 1, m = 0;
        while(l < r){
            m = l + Math.floor((r - l) / 2);
            if(this.#weights[m] < rand) l = m + 1;
            else r = m;
        }
        return this.#choices[l];
    }
    spinthelottery(){
        return this.choose();
    }


}

class KeySet{

    static #keys = new Set();
    static #initialized = false;
    static #specialchars = new Map([
        [" ", "\"\""],
        ["Enter", "⏎"],
        ["Shift", "⇧"],
        ["Control", "Ctrl"],
        ["Alt", "Alt"],
        ["Tab", "⇥"],
        ["CapsLock", "⇪"],
        ["ArrowUp", "↑"],
        ["ArrowDown", "↓"],
        ["ArrowLeft", "←"],
        ["ArrowRight", "→"],
        ["Backspace", "⌫"],
        ["Delete", "⌦"],
        ["Escape", "⎋"],
        ["Insert", "⎀"],
        ["Home", "⇱"],
        ["End", "⇲"],
        ["PageUp", "⇞"],
        ["PageDown", "⇟"],
        ["PrintScreen", "⎙"],
        ["Pause", "⏸"],
        ["NumLock", "⇭"],
        ["ScrollLock", "⇳"],
    ]);
    static #mspecialchars = new Map();
    static resetkey = this.#specialchars.get("Escape");
    static #nope = new Set([
        "\"", "\\",
    ]);
    // static #charmap = new Uint16Array(Math.pow(2,16));

    static onnewkey = () => {};
    static onoofkey = () => {};

    static getkeys(){
        return this.#keys;
    }
    static contains(key){
        return this.#keys.has(key);
    }
    static spcontains(spkey){
        return this.#specialchars.has(spkey);
    }
    static check(key){
        if(this.spcontains(key)) key = this.#specialchars.get(key);
        else if(key.length <= 1) return true;
        else return false;
    }
    static keydown(e){
        let key = e.key;
        if(this.#nope.has(key)) return;
        // if(key.length > 1) {}
        if(this.spcontains(key)) key = this.#specialchars.get(key);
        else if(key.length > 1) return;
        if(key === this.resetkey){
            for(const k of this.#keys){
                this.#keys.delete(k);
                const ekey = this.#mspecialchars.has(k) ? this.#mspecialchars.get(k) : k;
                this.onoofkey({key: k, ekey: ekey});
            }
        }
        if(this.contains(key)) return;

        this.#keys.add(key);
        this.onnewkey({key: key, ekey: e.key});
    }
    static keyup(e){
        let key = e.key;
        if(this.spcontains(key)) key = this.#specialchars.get(key);
        else if(key.length > 1) return;
        if(!this.contains(key)) return;

        this.onoofkey({key: key, ekey: e.key});
        this.#keys.delete(key);
    }

    static init(){
        if(this.#initialized) return;
        this.#initialized = true;

        for (const [k, v] of this.#specialchars) {
            this.#mspecialchars.set(v, k);
        }
        window.addEventListener("keydown", this.keydown.bind(this), {passive: true});
        window.addEventListener("keyup", this.keyup.bind(this), {passive: true});
    }
}