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
    #curr = 0;
    #lastfire = 0;
    #limit = 100;
    #q = new PerSec();
    #callback = () => new Error("not set yet noobb");
    #trigger = setTimeout(() => {}, 0);
    #log = false;

    constructor(limit, callback, log = false){
        this.#limit = limit;
        this.#callback = callback;
        this.#curr = performance.now() - this.#limit;
        this.#q.setwindow(limit);
        this.#lastfire = 0;
        this.#log = log;
    }

    fire(...args){
        this.#q.shift();
        if(this.#q.getq().length === 0){
            if(this.#log) console.log("fired");
            this.#callback(...args);
        }
        else{
            if(this.#trigger) clearTimeout(this.#trigger);
            this.#trigger = setTimeout(() => {
                this.fire(...args);
            }, this.#limit);

        }
        this.#q.add();
        this.#lastfire = performance.now();

    }

    getrecent(){
        return this.#q.length === 0 ? this.#lastfire : this.#q.getq().at(-1);
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

    constructor(el, activeclass = "active", classprefix = "*"){ // maybe do class prefix later im lazy
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

    set(arr = [], delay = 0, duration = 0){
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
        }, delay + duration + this.#decay);
    }
    pass(reverse = randint(1), nucleationsites = randint(floor(this.len / 2) - 1, 1),
    step = randint(floor(this.len / max(1, nucleationsites - 1))-1, 1), delay = randint(150, 350) / 2){
        const id = this.#genid();
        // const nucleationsites = randint(floor(this.len / 2) - 1, 1);
        // const step = randint(floor(this.len / nucleationsites)-1, 1);
        // const delay = randint(150, 350) / 20; // 100ms
        let totaldelay = 0;
        const maxstart = max(0, this.len - nucleationsites*step), start = randint(maxstart);
        const rev = reverse ? -1 : 1;

        for(let i = reverse ? this.len - start - 1: start; 
            reverse ? i >= 0 : i < this.len; i += rev){

            let idx = i;
            const indices = [];
            while(idx >= 0 && idx < this.len && indices.length < nucleationsites){
                indices.push(idx);
                idx += step * rev;
            }

            this.set(indices, totaldelay, delay);
            // setTimeout(() => {log(this.#activeq)}, totaldelay+delay);
            totaldelay += delay;
        }
        
        // this.#schedulereset(totaldelay, id);
        return totaldelay;
    }
}