console.log(document.getElementById("before-screen"));
function eid(id) {
    return document.getElementById(id);
}
function eq(query) {
    return document.querySelector(query);
}
function eqa(query) {
    return document.querySelectorAll(query);
}

function clearPlayScreen(){
    eid("before-screen").remove();
    document.body.style.zIndex = 1;
    eid("main").style.zIndex = 1;
}
function clearPlay(){
    eid("play").remove();
    // eid("before-screen").remove();
}

const main = eid("main");

const buttonflicker = () => {
    const el = eid("play-button");
    if (!el || el.disabled) return;
    const duration = 50;
    new Ani("#play-button").rule({
        from: [{ opacity: 0 }],
        to: [{ opacity: 1 }],
        duration: 100 + Math.random() * 100,
        easing: "ease-out",
        forwards: true,
        additive: [false, false],
        otherignore: true,
    });
    setTimeout(buttonflicker, 15 + ((Math.random() < .75) ? Math.random() * 25 : 300 + Math.random() * 3000));
};
setTimeout(buttonflicker, 1000);

const playAnimations = [
    collapse = () => {
        new Ani("#anim-link").then(() => {
            eq("#anim-link").style.display = "block";
        }).rule({
            from: [{opacity: "0"}],
            to: [{opacity: "1"}],
            duration: 500,
            easing: "ease-out",
            forwards: true,
            additive: [false, false],
        });


        new Ani("#play-button")
        .rule({
            from: [{rotate: "0deg"}],
            to: [{rotate: "-15deg"}],
            duration: 150,
            easing: "ease-out",
            forwards: true,
            additive: [false, false],
        })
        .rule({
            from:[{rotate: "0deg", opacity: "1", marginTop: "0px"}],
            to:[{rotate: "700deg", opacity: "0", marginTop: "100px"}],
            duration: 700,
            easing: "ease-in",
            forwards: true,
            additive: [true, false],
        }).then(() => {
            eid("play-button").style.display = "none";
        });

        new Ani(".collapse").rule({
            from: [{rotate: "0deg"}],
            to: [{rotate: "-90deg"}],
            duration: 700,
            easing: "ease-in",
            forwards: true,
            additive: [false, false],
        })       
        .rule({
            from: [{rotate: "0deg"}],
            to: [{rotate: "15deg"}],
            duration: 300,
            easing: "ease-out",
            forwards: true,
            additive: [true, true],
        })
        .rule({
            from: [{rotate: "0deg"}],
            to: [{rotate: "-90deg"}],
            duration: 400,
            easing: "ease-in",
            forwards: true,
            additive: [true, false],
        })
        .then(() => {
            eq(".collapse").classList.remove("filter");
            clearPlayScreen();
            document.body.style.transform = "translateX(0)";
        })
        .rule({
            from: [{rotate: "0deg"}],
            to: [{rotate: "-200deg"}], // push a little extra to end
            duration: 700,
            easing: "ease-in",
            forwards: true,
            additive: [true, false],
        })
        .then(() => {
            clearPlay();
        });
    }
]



eid("play-button").onclick = (e) => {
    e.target.disabled = true;
    playAnimations[Math.floor(Math.random() * playAnimations.length)]();
    
}
