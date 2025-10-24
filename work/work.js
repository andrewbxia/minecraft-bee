const main = eid("main");

const cube = eq(".cube");




const size = pint(elprop(cube, "--size"));
attachdebug(size, "size");

const returncubetransform = (props = {}) => {
    const rotatex = props.rotatex || 90;
    const rotatey = props.rotatey || 0;
    const rotatez = props.rotatez || 0;
    const perspective = props.perspective || size / 2;
    const translatex = props.translatex || size / 2;
    const translatey = props.translatey || size / 2;

    return `rotateX(${rotatex}deg) rotateY(${rotatey}deg) rotateZ(${rotatez}deg) perspective(${perspective}px) translate(calc(-1 * ${translatex}px), calc(-1 * ${translatey}px))`;
}

document.addEventListener("mousemove", (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    const midheight = window.innerHeight / 2;
    const midwidth = window.innerWidth / 2;
    const xdiff = e.clientX - midwidth;
    const ydiff = e.clientY - midheight;
    const rotateX = (ydiff / midheight) * 90;
    const rotateY = (xdiff / midwidth) * 90;

    cube.style.transform = returncubetransform({
        translatex: x * size,
        translatey: y * size,
        // rotatex: rotateX,
        // rotatey: rotateY
    });
});

document.dispatchEvent(new MouseEvent("mousemove"));