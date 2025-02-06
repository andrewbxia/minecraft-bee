class Ani{
    #mode = "none";
    #next = Promise.resolve();
    #done = false;
    #query = "";
    #start = 0;
    #curr = 0;
    #anikeys = [];
    #querycnt = Infinity;
    static #counter = 0;
    static #animations = new Map(); // failed system to keep track of animations gonna fix latr


    constructor(query, params = {}){
        if (!query) {
            this.#mode = "obj";
            return this;
        }
        
        this.#query = query;
        this.#querycnt = params.querycnt || Infinity;
        this.#done = false;
        this.#start = performance.now();
        this.#curr = this.#start;
        this.#mode = "query";
    }
    
    #queuePromise(action, duration = 0) {
        this.#next = this.#next.then(() => new Promise((resolve) => {
            action();
            setTimeout(() => {
                resolve();
            }, duration);
        }));
        return this;
    }

    #increment(){
        Ani.#counter++;
        return Ani.#counter;
    }

    #rmvani(id){
        id--;
        // console.log(id, Ani.#animations.get(id));
        // Ani.#animations.get(id)?.cancel();
        Ani.#animations.delete(id);
        console.log(Ani.#animations.size);
    }

    #cleanupcleanupeverybodyeverywherecleanupcleanupeverybodydoyourshare(){
        Ani.#animations.forEach((ani, id) => {
            ani.cancel();
            Ani.#animations.delete(id);
        });
    }

    #addunit(value, addition) { // ripped from chatgpt
        const regex = /^(-?\d*\.?\d+)([a-z%]*)$/i;
        const match = value.match(regex);

        if (!match) {
            throw new Error(`this value is likely |none| but still poopoo: ${value}. For values like rotate, set them to a defulat value like 0deg`);
        }

        const [, num, unit] = match;
        const newValue = Math.max(parseFloat(num) + addition);
        // console.log(num, unit, addition, newValue);

        return `${newValue}${unit}`;
    }

    contif(condition){
        return this.#queuePromise(() => {
            console.log(condition());   
            this.#done = this.#done || !condition();
        });
    }

    delay(duration = 1000){
        return this.#queuePromise(() => {}, duration);
    }

    then(callback, duration = 0) {
        return this.#queuePromise(() => {
            callback(this);
        }, duration);
    }

    finish() {
        return this.#queuePromise(() => {
            this.#done = true;
            // this.#cleanupcleanupeverybodyeverywherecleanupcleanupeverybodydoyourshare();
        });
    }

    rule(obj) {
        // TODO: prevent rule interference across ani instances
        // ignore obj mode
        if (this.#mode == "obj") {
            return this;
        }
        if (this.#done) {
            console.error("Animation already finished");
            return this;
        }
        const duration = obj.duration || 1000;
        const easing = obj.easing || "linear";
        const forwards = obj.forwards || false;
        const additive = obj.additive || [false, false];
        const from = obj.from || [];
        const to = obj.to || [];
        const otherignore = obj.otherignore || false;
        const elements = document.querySelectorAll(this.#query);
        // const id = this.#increment(); // do this in the loop
        let idx = 0;
        let keys = [];
        while (idx < Math.min(this.#querycnt, elements.length)) {
            keys.push(this.#increment());
            idx++;
        }
        idx = 0;

        return this.#queuePromise(() => {
            if (this.#done) {
                console.error("Animation already finished");
                return this;
            }
            for (const el of elements) {
                if (idx >= this.#querycnt) {
                    break;
                }
                idx++;

                const key = keys.shift();
                if (!otherignore && el.dataset.ani) {
                    if(key < el.dataset.ani)
                        continue;
                    this.#rmvani(el.dataset.ani);
                }
                // const key = performance.now();
                if(!otherignore)
                    el.dataset.ani = key;
                const frames = [{}, {}];

                from.forEach((item) => {
                    for (const prop in item) {
                        const val = item[prop];
                        frames[0][prop] = additive[0]
                            ? this.#addunit(getComputedStyle(el)[prop], parseFloat(val))
                            : val;
                    }
                });

                to.forEach((item) => {
                    for (const prop in item) {
                        const val = item[prop];
                        frames[1][prop] = additive[1]
                            ? this.#addunit(getComputedStyle(el)[prop], parseFloat(val))
                            : val;
                    }
                });

                Ani.#animations.set(
                    key,
                    el.animate(frames, {
                        duration,
                        easing,
                        fill: forwards ? "forwards" : "none"
                    })
                );
                console.log(this.#query, Ani.#animations.get(key));
                Ani.#animations.get(key).onfinish = () => Ani.#animations.delete(key);
            }
        }, duration);
    }
}

/*
///use case
new Ani(query).rule({// adds three and 49 
    from:[
        width: "50px",
        height: "70px",
    ]
    to:[
        width: "3px",
        height: "49px",
    ],
    duration: 3000,
    forwards: true,
    easing: "ease-out",
    additive: [true, false], // adds intiially, transitions to absolute

}).rule({ // sets to zero and five, then transitions to a width of 15
    from:[
        width: "0px",
        height: "5px",
    ],
    to: [
        width: "15px",
    ],
    duration: 1000,
    forwards: true,
    easing: "linear",
    additive: [false, true], // sets to zero and five, then transitions to 15 px more than initial
}).rule({
    to: [
        height: "20px",
    ],
    duration: 500,
    forwards: false,
    easing: "ease-in",
    additive: [false, true], // ease adds on 20px. If additive[1] was false, then it would transition from current state to 20px width.
})

*/