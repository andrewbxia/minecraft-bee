const fft = eid("fft");
const fftp = eid("fft-p"); // fft precision slider
const fftstart = eid("fft-start"); // let er rip

const bgcolor = "black";
let mode = "none";
const start = -1;
const strokes = []; // arr of strokes
const strokeidxs = [0]; // indices of stroke ENDS
const pointsize = 2;
const pointhalf = pointsize / 2;
const pointcolor = "white";
const precision = 5;
fftp.oninput = (e) => {
    precision = pint(e.target.value);
}

let cutoffidx = 0; // basic undo/redo functionality

const prunestrokes = () => {
    while(strokeidxs[cutoffidx] < strokes.length){
        strokes.pop();
    }
    strokeidxs.length = cutoffidx + 1;
}
const addpoint = (x, y, t = performance.now()) => {
    strokeidxs[cutoffidx] = strokes.length;
    strokes.push([x, y, t]);
}
const pushstroke = () => {
    
}
const drawpoint = (x, y, ctx) => ctx.fillRect(x - pointhalf, y - pointhalf, pointsize, pointsize);

// drawing handling
const lastclick = {x: 0, y: 0};
let movedsince = true;
/*
input methods: hold + drag to draw -> stop hold
click + move to draw -> click

*/

fft.onmousedown = (e) => {
    lastclick.x = e.clientX;
    lastclick.y = e.clientY;
    if(mode === "draw"){
        document.onmouseup(e);
        return;
    }
    mode = "draw";
    prunestrokes();
    cutoffidx++;
    document.onmousemove(e);
    movedsince = false;
}
fft.onmouseup = (e) => {
    
}
document.onmousemove = (e) => {
    if(mode === "none") return;
    // if(e.target !== fft) return; allow drawing outside
    movedsince = true;

    const rect = brect(fft);
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    addpoint(x, y);
}
document.onmouseup = (e) => {
    if(!movedsince){
        movedsince = true;
        return;
    }
    if(mode === "draw"){
        // finish stroke
    }
    mode = "none";
}

const redo = () => {
    cutoffidx = min(strokeidxs.length - 1, cutoffidx + 1);
}
const clr = () => {
    cutoffidx = 0;
}

const undo = () => {
    cutoffidx = max(0, cutoffidx - 1);
}



// fft stuff
class Complex{
    re = 0;
    im = 0;
    static zero = new Complex(0, 0);
    constructor(re = 0, im = 0){
        this.re = re;
        this.im = im;
    }
    plus(oth = Complex.zero, self = false){
        let ore = oth.re ?? 0;
        let oim = oth.im ?? 0;
        if(typeof oth === "object" && !(oth instanceof Complex)){
            ore = oth[0] ?? 0;
            oim = oth[1] ?? 0;
        }

        if(self){
            this.re += ore;
            this.im += oim;
            return this;
        }
        return new Complex(this.re + ore, this.im + oim);
    }
    times(oth = Complex.zero, self = false){
        let ore = oth.re ?? 0;
        let oim = oth.im ?? 0;
        if(typeof oth === "object" && !(oth instanceof Complex)){
            ore = oth[0] ?? 0;
            oim = oth[1] ?? 0;
        }
        const nre = this.re * ore - this.im * oim;
        const nim = this.re * oim + this.im * ore;
        if(self){
            this.re = nre;
            this.im = nim;
            return this;
        }
        return new Complex(nre, nim);
    }
    norm(self = false){
        const mag = this.mag;
        const nre = this.re / mag;
        const nim = this.im / mag;
        if(self){
            this.re = nre;
            this.im = nim;
            return this;
        }
        return new Complex(nre, nim);
    }
    get mag(){
        return sqrt(this.re * this.re + this.im * this.im);
    }
    get phase(){
        return atan2a(this.im, this.re);
    }
    exp(){
        const r = Math.exp(this.re);
        return new Complex(r * Math.cos(this.im), r * Math.sin(this.im));
    }
    toString(){
        return `${this.re} + ${this.im}i`;
    }
}

/*
v: x, y -> 0, 1 -> strokes[idx][0 or 1]
k: bin idx
start: start idx
end: end idx excl
step: step size
*/



const calcfft = (v, k, start, end, step = 1) => {
    const N = floor((end - start) / step);

    if(N <= 0) return Complex.zero;
    if(N & (N - 1)){
        // terr("not power of 2", N, end, start, step);
    }
    if(N === 1){
        return new Complex(strokes[start][v], 0);
    }
    
    const even = calcfft(v, k, start, end, step * 2);
    const odd = calcfft(v, k, start + step, end, step * 2);

    const expterm = new Complex(0, -2 * Math.PI * k / N).exp();

    return even.plus(expterm.times(odd));
}

// resetting fft
const fftcoeffs = {x: [], y: []};
const resetfft = () => {
    const power = ceil(log2(precision));
    const bins = 1 << power;
    const norm = 1 / sqrt(bins);
    
    if(fftcoeffs.x.length < bins){
        fftcoeffs.x.length = bins;
        fftcoeffs.y.length = bins;
    }
    for(let i = 0; i < bins; i++){
        try{

        fftcoeffs.x[i] = calcfft(0, i, 0, bins).mag * norm;
        fftcoeffs.y[i] = calcfft(1, i, 0, bins).mag * norm;
        }
        catch(e){
            terr("FFT calculation error:", e, bins);
        }
    }
        attachdebug(performance.now(), fftcoeffs.x.join(", "), fftcoeffs.y.join(", "));


}


// drawing
function draw(){
    const ctx = fft.getContext("2d");
    const w = fft.width;
    const h = fft.height;
    // clear
    ctx.fillStyle = bgcolor;
    ctx.fillRect(0, 0, w, h);
    // draw points
    
    ctx.fillStyle = pointcolor;
    for(let idx = 0; idx < strokeidxs[cutoffidx]; idx++){
        const p = strokes[idx];
        drawpoint(p[0], p[1], ctx);
    }
    // attachdebug(performance.now(), fftcoeffs.x.join(", "), fftcoeffs.y.join(", "));
    requestAnimationFrame(draw);
}
draw();



/*
ideas

hook up fft to audio context, sine audio data matches points drawn
like that painting video, have colors preemptivley come in or somehig

*/