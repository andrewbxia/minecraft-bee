const fft = eid("fft");
const fftp = eid("fft-p"); // fft precision slider
const fftstart = eid("fft-start"); // let er rip

const bgcolor = "black";
let mode = "none";
let start = -1;
const strokes = []; // arr of strokes
const strokeidxs = [0]; // indices of stroke ENDS
const pointsize = 2;
const pointhalf = pointsize / 2;
const pointcolor = "white";
let precision = 5;
const center = [0, 0];
fftp.oninput = (e) => {
    // precision = pint(e.target.value);
    precision = 1 << parseInt(e.target.value);
    resetfft();
}

window.addEventListener("resize", () => {
    fft.width = fft.clientWidth;
    fft.height = fft.clientHeight;
    center[0] = fft.width / 2;
    center[1] = fft.height / 2;
    // resetfft();
});
window.dispatchEvent(new Event("resize"));


let cutoffidx = 0; // basic undo/redo functionality

const prunestrokes = () => {
    while(strokeidxs[cutoffidx] < strokes.length){
        strokes.pop();
    }
    strokeidxs.length = cutoffidx + 1;
}
const addpoint = (x, y, t = performance.now()) => {
    strokeidxs[cutoffidx] = strokes.length;
    strokes.push([x - center[0], y - center[1], t]);
}
const pushstroke = () => {
    
}
const drawpoint = (x, y, ctx, size = pointsize) => 
    ctx.fillRect(x - pointsize/2 + center[0], y - pointsize/2 + center[1], size, size);

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
    scale(scalar = 1, self = false){
        if(self){
            this.re *= scalar;
            this.im *= scalar;
            return this;
        }
        return new Complex(this.re * scalar, this.im * scalar);
    }
    get mag(){
        return sqrt(this.re * this.re + this.im * this.im);
    }
    get phase(){
        return atan2a(this.im, this.re);
    }
    exp(){
        const r = Math.exp(this.re);
        return new Complex(r * cos(this.im), r * sin(this.im));
    }
    toString(){
        return `${this.re} + ${this.im}i`;
    }
}

const lerpstrokes = [];

function getstroke(idx){
    if(idx >= strokes.length){
        return lerpstrokes[idx - strokes.length];
    }
    return strokes[idx];
}

function nextpow2(n){
    return 1 << ceil(log2(max(1, n)));
}

// helper func to have specific # of bins
function mapidx(idx, fromlen, tolen){
    return floor(idx * tolen / fromlen);
}

const fftcoeffs = [];

function calcfft(arr){
    const N = arr.length;
    if(N === 1) return [arr[0]];
        // even  0, return 0 point
    if((N & (N - 1)) !== 0) terr("N not power of 2");

    
    const evens = new Array(N / 2); // splitting
    const odds  = new Array(N / 2);
    for(let i = 0; i < N / 2; i++){
        evens[i] = arr[2*i];
        odds[i]  = arr[2*i + 1];
    }

    const ffte = calcfft(evens);
    const ffto = calcfft(odds);

    const out = new Array(N);
    for(let k = 0; k < N / 2; k++){
        const expterm = new Complex(0, -2 * pi * k / N).exp();
        const t = expterm.times(ffto[k]); // ffto[k] * expterm
        out[k] = t.plus(ffte[k]);         // ffte[k] + t
        out[k + N/2] = t.times([-1, 0]).plus(ffte[k]); // ffte[k] - t
    }
    return out;
}


function lininterp(iter){ // extends signal to 2^n
    const from = strokes[strokeidxs[cutoffidx] - 1];
    const to = strokes[0];
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];

    let n = 0;
    lerpstrokes.length = iter;
    while(n < iter){
        const dt = n + 1;
        lerpstrokes[n++] = [
            from[0] + dx * (dt / iter),
            from[1] + dy * (dt / iter)
        ];
    }
}

const totalpath = [];

const resetfft = () => {
    const M = strokeidxs[cutoffidx]; // # of sampels
    const z = [];
    const N = nextpow2(M);
    const K = nextpow2(precision);
    if(M === 0){
        fftcoeffs.length = 0;
        return;
    }
    for(let i = 0; i < K; i++){
        const midx = mapidx(i, K, M);
        z.push(getstroke(midx));
    }
    // lininterp();

    const C = calcfft(z);
    fftcoeffs.length = K;
    for(let k = 0; k < K; k++){
        fftcoeffs[k] = C[k].scale(1 / K);
    }

    // total path
    const dt = 0.002;
    const iter = floor(1 / dt);
    totalpath.length = iter + 1;
    for(let i = 0; i <= iter; i++){
        const t = i * dt;
        let sum = Complex.zero;
        for(let k = 0; k < K; k++){
            const coeff = fftcoeffs[k];
            const freq = k < K / 2 ? k : k - K;
            const angle = t * freq * 2 * pi;
            const vec = coeff.times(new Complex(0, angle).exp());
            sum = sum.plus(vec);
        }
        totalpath[i] = [sum.re, sum.im];
    }


    // start = performance.now();
};
resetfft();


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
    // draw center
    ctx.fillStyle = "red";
    drawpoint(0, 0, ctx, 5);

    const N = fftcoeffs.length;
    if(N === 0){
        requestAnimationFrame(draw);
        return;
    }

    const t = (performance.now() - start);
    // 30 points / sec
    const speed = 1000 / 30 * strokeidxs[cutoffidx];

    // start epicycle at center
    let prev = [center[0], center[1]];

    // drawing styles
    ctx.lineWidth = 1;

    // total path
    ctx.strokeStyle = "lime";
    ctx.moveTo(center[0], center[1]);
    ctx.beginPath();
    for(let i = 1; i < totalpath.length; i++){
        const p = totalpath[i];
        const x = p[0] + center[0];
        const y = p[1] + center[1];
        ctx.lineTo(x, y);
    }
    ctx.stroke();

    // epicenters
    for(let k = 1; k < N; k++){
        // if(k > precision) break;
        let kidx = floor(k / 2);
        if(k % 2 === 0) kidx = N - kidx;

        const coeff = fftcoeffs[kidx];
        const freq = kidx < N / 2 ? kidx : kidx - N;
        const r = coeff.mag;
        const angle = t * freq * 2 * pi / speed;

        const vec = coeff.times(new Complex(0, angle).exp());
        
        // draw circle
        ctx.strokeStyle = "blue";
        ctx.beginPath();
        ctx.arc(prev[0], prev[1], r, 0, 2 * pi);
        ctx.stroke();

        // draw radius line
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(prev[0], prev[1]);

        
        const nx = prev[0] + vec.re;
        const ny = prev[1] + vec.im;
        ctx.lineTo(nx, ny);
        ctx.stroke();

        prev = [nx, ny];
    }
    
        

    ctx.fillStyle = "lime";
    drawpoint(prev[0] - center[0], prev[1] - center[1], ctx, 5);

    requestAnimationFrame(draw);
}

draw();
/*
ideas

hook up fft to audio context, sine audio data matches points drawn
like that painting video, have colors preemptivley come in or somehig

*/