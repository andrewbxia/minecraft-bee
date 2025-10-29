const main = eid("main");
const cube = eq(".cube");


const offsetdata = {
    X: 0,
    Y: 0,
    Z: 0,
};
function resetoffsetdata(){
    offsetdata.X = offsetdata.Y = offsetdata.Z = 0;
}


const size = pint(elprop(cube, "--size"));
attachdebug(size, "size");

const returncubetransform = (props = {}) => {
    const rotatex = (props.rotatex || 0) + offsetdata.X;
    const rotatey = (props.rotatey || 0) + offsetdata.Y;
    const rotatez = (props.rotatez || 0) + offsetdata.Z;
    const perspective = props.perspective || 5000;
    const translatex = props.translatex || 0;
    const translatey = props.translatey || 0;
    const translatez = props.translatez || 0;
    return `translate(-50%, -50%) rotateX(${rotatex}deg) rotateY(${rotatey}deg) rotateZ(${rotatez}deg) translate3d(calc(-1 * ${translatex}px), calc(-1 * ${translatey}px), ${translatez}px)`;
    // return `translate(-50%, -50%) rotateX(${rotatex}deg) rotateY(${rotatey}deg) rotateZ(${rotatez}deg) perspective(${perspective}px) translate3d(calc(-1 * ${translatex}px), calc(-1 * ${translatey}px), ${translatez}px)`;
}

document.addEventListener("mousemove", (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    const midheight = window.innerHeight / 2;
    const midwidth = window.innerWidth / 2;
    const xdiff = e.clientX - midwidth;
    const ydiff = e.clientY - midheight;
    const rotateX = -(ydiff / midheight) * 90;
    const rotateY = (xdiff / midwidth) * 90;

    cube.style.transform = returncubetransform({
        translatey: y * size*.1,
        translatex: x * size*.1,
        rotatex: rotateX/2,
        rotatey: rotateY/2,
        // perspective: abs(rotateX*rotateY) + 500, // funny rendering mode
    });
});

// document.dispatchEvent(new MouseEvent("mousemove"));
const sidesdata = {
    front: {
        other: "back",
        axis: "x",
        offset: 0,
    },
    back: {
        other: "front",
        axis: "x",
        offset: 180,
    },
    left: {
        other: "right",
        axis: "y",
        offset: -90,
    },
    right:{
        other: "left",
        axis: "y",
        offset: 90,
    },
    top:{
        other: "bottom",
        axis: "x",
        offset: 90,
    },
    bottom: {
        other: "top",
        axis: "x",
        offset: -90,
    }
}

let activeside = "front";

function setactiveside(side){
    // reset nonactive side
    eq(".cube > ." + activeside).classList.remove("active");
    eq(".cube > ." + sidesdata[activeside].other).classList.remove("inactive");
    const data = sidesdata[side];
    // set active
    eq(".cube > ." + side).classList.add("active");
    eq(".cube > ." + data.other).classList.add("inactive");
    activeside = side;
    resetoffsetdata();
    offsetdata[data.axis.toUpperCase()] = data.offset;
    
    // document.dispatchEvent(new MouseEvent("mousemove"));
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
    log("set active side to", side);
    attachdebug(side, "activeside");

    
});