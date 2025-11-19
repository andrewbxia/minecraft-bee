const main = eid("main");
const cube = eq(".cube");


const offsetdata = {
    X: 0,
    Y: 0,
    Z: 0,
};
const cursor = {
    X: 0,
    Y: 0,
};
function resetoffsetdata(){
    offsetdata.X = offsetdata.Y = offsetdata.Z = 0;
}

function sidepropogate(side, func){
    let curr = cube;
    while(curr.querySelector("." + side)){
        curr = curr.querySelector("." + side);
        func(curr);
    }
}

const size = pint(elprop(cube, "--width"));
// attachdebug(size, "size");
let funnypersp = false;


const returncubetransform = (props = {}) => {
    const rotatex = (props.rotatex || 0) + offsetdata.X;
    const rotatey = (props.rotatey || 0) + offsetdata.Y;
    const rotatez = (props.rotatez || 0) + offsetdata.Z;
    const perspective = props.perspective || 5000;
    const translatex = props.translatex || 0;
    const translatey = props.translatey || 0;
    const translatez = props.translatez || 0;
    
    if(!funnypersp){
        // normie pose
        return `translate(-50%, -50%) rotateX(${rotatex}deg) rotateY(${rotatey}deg) rotateZ(${rotatez}deg) translate3d( ${translatex}px, ${translatey}px, ${translatez}px)`;
    }
    else 
        return `translate(-50%, -50%) rotateX(${rotatex}deg) rotateY(${rotatey}deg) rotateZ(${rotatez}deg) perspective(${perspective}px) translate3d(calc(-1 * ${translatex}px), calc(-1 * ${translatey}px), ${translatez}px)`;
}

let inputdata = {};

const cubetransform = new MeteredQueueTrigger(50, (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    const rotmultiplier = .5;
    const midheight = window.innerHeight / 2;
    const midwidth = window.innerWidth / 2;
    const xdiff = (e.clientX - midwidth) * (sidesdata[activeside].invertX ? -1 : 1);
    const ydiff = (e.clientY - midheight) 
    // * (sidesdata[activeside].invertY ? -1 : 1);
    const rotateX = -(ydiff / midheight) * 90 * rotmultiplier;
    const rotateY = (xdiff / midwidth) * 90 * rotmultiplier;

    // const inputdata = {};
    inputdata.rotatex = rotateX;
    inputdata.rotatey = rotateY;
    inputdata.rotatez = null;
    if(sidesdata[activeside].toZ){
        inputdata.rotatey = null;
        inputdata.rotatez = rotateY;
    }
    inputdata.perspective = abs(rotateX*rotateY) + 500; // funny rendering mode
    inputdata.translatey = y * size*.1;
    inputdata.translatex = x * size*.1;

    cube.style.transform = returncubetransform(inputdata);
    BGBars.fire(Infinity, Infinity, inputdata);

});

document.onmousemove = (e) => {
    cursor.X = e.clientX;
    cursor.Y = e.clientY;
    cubetransform.fire(e);
}
// document.dispatchEvent(new MouseEvent("mousemove"));
const sidesdata = {
    front: {
        other: "back",
        axis: "x",
        offset: 0,
        invertX: false,
        toZ: false,
        // neighbors is up right down left from side's perspective
        neighbors: ["top", "right", "bottom", "left"],
    },
    back: {
        other: "front",
        axis: "x",
        offset: 180,
        invertX: true,
        toZ: false,
        neighbors: ["bottom", "right", "top", "left"],
    },
    left: {
        other: "right",
        axis: "y",
        offset: -90,
        invertX: false,
        toZ: false,
        neighbors: ["top", "front", "bottom", "back"],
    },
    right:{
        other: "left",
        axis: "y",
        offset: 90,
        invertX: false,
        toZ: false,
        neighbors: ["top", "back", "bottom", "front"],
    },
    top:{
        other: "bottom",
        axis: "x",
        offset: 90,
        invertX: true,
        toZ: true,
        neighbors: ["back", "right", "front", "left"],
    },
    bottom: {
        other: "top",
        axis: "x",
        offset: -90,
        invertX: false,
        toZ: true,
        neighbors: ["front", "right", "back", "left"],
    }
}
const sides = Array.from(Object.keys(sidesdata));

let cssstrend =   `}\n}\n`;
const bordermaps = [
    "::before",
    ">.decor::after",
    "::after",
    ">.decor::before",
];


let cssstr = `.cube{
div.offset >.scale >.ind-rot{

`;
const sidecss = Object.fromEntries(sides.map(k => [k, ""]));

sides.forEach(side => {

// div.ind-rot.back-active.right
     
    sidesdata[side].neighbors.forEach((neighbor, i) => {
        sidecss[side] += `
        &.${neighbor}-active.${side}${bordermaps[i]}, `;
        // sidecss[neighbor] += `&.active.${side}${bordermaps[i]}, `;
    });
});
for(const side of sides){
    cssstr += `
    ${sidecss[side].slice(0, -2)}{
        content: var(--desc); 
    }`;
    // did this when I stored sides data in javascript instead of css vars lmao
    // cssstr += `
    // ${sidecss[side].slice(0, -2)}{
    //     content: "${side}";
    // }
    // `;
}
cssstr += cssstrend;
styling(cssstr);
attachdebug(cssstr);


let activeside = "front";

function setactiveside(side){
    // reset nonactive side
    sidepropogate(activeside, (el) => el.classList.remove("active"));
    sidepropogate(sidesdata[activeside].other, 
        (el) => el.classList.remove("inactive"));
    
    // remove active classes
    const clss = activeside + "-active";
    eqa(`.cube div.${clss}.ind-rot`).forEach(el => el.classList.remove(clss));

    const data = sidesdata[side];
    // set active
    sidepropogate(side, (el) => el.classList.add("active"));
    sidepropogate(data.other, (el) => el.classList.add("inactive"));
    
    // set activeside var and offsetdata
    activeside = side;
    resetoffsetdata();
    offsetdata[data.axis.toUpperCase()] = data.offset;
    // add active classes
    sidesdata[activeside].neighbors.forEach(neighbor => {
        const clss = activeside + "-active";
        eq(`.cube div.${neighbor}.ind-rot`)?.classList.add(clss);
    });
    document.dispatchEvent(new MouseEvent("mousemove", {
        clientX: cursor.X,
        clientY: cursor.Y,
    }));
}

setactiveside("front");
cube.addEventListener("click", (e) => {
    const target = e.target;
    const sideelement = target.closest(".cube > div");
    if(!sideelement) {
        warn("no side found");
        return;
    }
    const side = sideelement.dataset.side;
    setactiveside(side);
    // attachdebug(side, "activeside");
});


// eqa(".cube>div").forEach(side => {
//     const sidename = side.dataset.side;
//     side.addEventListener("mouseenter", (e) => {
//         sidesdata[sidename].neighbors.forEach((neighbor, i) => {
//             if(activeside !== neighbor) return;
//             const el = side.querySelector("div>div>div");
//             log(el);
//             el.style.setProperty(`--txt`, `"${sidename}"`);
//             el.classList.add(`n-${i+1}`);
//         });
//     });
//     side.addEventListener("mouseleave", (e) => {
//         sidesdata[sidename].neighbors.forEach((neighbor, i) => {
//             side.querySelector(".decor").parentElement.style.setProperty(`--txt`, `""`);
//         });
//     });
// });

document.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = -e.deltaY;
    let currperspective = pint(main.style.perspective);
    const newperspective = clamp(currperspective + delta, 100, 5000);

    main.style.perspective = newperspective + "px";
    // log("perspective set to", newperspective);
}, { passive: false });

checkvisit();


document.addEventListener("click", (e) => {
    // attachdebug("clicked on", e.target.tagName, e.target.classList.toString()
    //     , e.target.id, eqa(".ind-rot").length);
});


function maxpoat(val, minval=.0005){
    val = poat(val);
    if(isnan(val) || abs(val) < minval) return minval;
    return val;
}

const limiter = 100;

FpsMeter.init();
KeySetSide.init();
ThemeSwitch.init();
BGBars.init({
    limiter,
    scrollfunc: (val) => ({Y: val, X: val}),
});
setInterval(() => {
    const transform = compst(eq(".cube")).transform;
    // get matrix3d valss (from chatgpt)
    const match = transform.match(/matrix3d\(([^)]+)\)/);
    if (match) {
        const values = match[1].split(',').map(Number);
        const product = values.reduce((acc, val) => maxpoat(acc) * maxpoat(val), 1);
        attachdebug("matrix3d product: " + product, transform, FpsMeter.maxfps, FpsMeter.avg);
        BGBars.fire(Infinity, Infinity, product);
    }
}, limiter);
