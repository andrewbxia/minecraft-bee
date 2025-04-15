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
