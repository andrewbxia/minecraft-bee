
window.addEventListener('devtoolschange', event => {
    if (event.detail.isOpen) {
        console.log('DevTools is open');
    } else {
        console.log('DevTools is closed');
    }
});
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
// play screen animations

function clearPlayScreen(){
    eid("before-screen").style.display = "none";
}
function clearPlay(){
    eid("play").style.display = "none";
    document.body.style.overflowY = "scroll";
    pageentered = true;
}   
function resetPlay(){
    eid("before-screen").style.display = "block";
    eid("play").style.display = "block";
    eid("play-button").disabled = false;
    eid("play-button").style.opacity = 1;
    document.body.style.overflowY = "hidden";
    pageentered = false;
}



const buttonflicker = () => {
    const el = eid("play-button");
    if (!el || el.disabled){
        setTimeout(buttonflicker, 1000);
        return;
    }
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
// setTimeout(buttonflicker, 1000);

const playAnimations = [
    function collapse() {
        // display animationjs link
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

        // funny play button spins
        new Ani("#play-button")
        .rule({
            from: [{rotate: "0deg", marginTop: "0px", marginLeft: "0px"}],
            to: [{rotate: "-100deg", marginTop: "-110px" , marginLeft: "0px"}],
            duration: 190,
            easing: "ease-out",
            forwards: true,
            additive: [false, false],
        })
        .rule({
            from:[{rotate: "0deg", opacity: "1", marginTop: "0px", marginLeft: "0px"}],
            to:[{rotate: "1100deg", opacity: "0", marginTop: "300px", marginLeft: "0px"}],
            duration: 700,
            easing: "ease-in",
            forwards: true,
            additive: [true, false],
        }).delay(1000) // arbitrary
        .reset();

        // hey text
        new Ani(".hey-text").rule({
            from: [{opacity: "1", marginTop: "0px", fontSize: "100px", rotate: "0deg", marginRight: "0px"}],
            to: [{opacity: "0", marginTop: "200px", fontSize: "200px", rotate: "-10deg", marginRight: "-50px"}],
            duration: 500,
            easing: "ease-out",
            forwards: true,
            additive: [false, false],
        }).delay(1000).reset({fontSize: "100px"});

        // collapse the .collapse div
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
        })
        .rule({
            from: [{rotate: "0deg"}],
            to: [{rotate: "-360deg"}], // push a little extra to end
            duration: 700,
            easing: "ease-in",
            forwards: true,
            additive: [true, false],
        })
        .then(() => {
            eq(".collapse").classList.add("filter");
            clearPlay();
        });
    },

    function slidein(){
        // display animationjs link
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
        const slideduration = 1980 / 3, collisionduration = 1980 / 2;

        // before-screen slides in
        
        const beforescreendelay = new Ani("#before-screen").then(() => {
            eq("#before-screen").style.left = "initial";
        })
        .rule({
            from: [{right: "0vw"}],
            to: [{right: "50vw"}],
            duration: slideduration,
            easing: "ease-out",
            forwards: true,
            additive: [false, false],
        });
        
        // slide-in slides in
        const slideindelay = new Ani(".slide-in").delay(beforescreendelay.whendone() - 100)
        .rule({
            from: [{left: "100%"}],
            to: [{left: "50%"}],
            duration: slideduration,
            easing: "ease-in",
            forwards: true,
            additive: [true, false],
        });

        // collision
        new Ani("#before-screen").delay(slideindelay.whendone() - 5)
        .rule({
            from: [{right: "50vw"}],
            to: [{right: "100vw"}],
            duration: collisionduration,
            easing: "ease-out",
            forwards: true,
            additive: [false, false],
        }).then(() => {
            clearPlayScreen();
            clearPlay();
        })
        .reset({left: "0"});

        // slide-in tumbles
        new Ani(".slide-in").delay(slideindelay.whendone())
        .rule({
            from: [{left: "50%", rotate: "0deg", bottom: "0%"}],
            to: [{left: "20%", rotate: "-20deg", bottom: "-150%"}],
            duration: collisionduration-10,
            easing: "cubic-bezier(.43,-0.3,1,.31)",
            forwards: true,
            additive: [false, false],
        }).reset({left: "100%"});



    }
]

eid("play-button").onclick = (e) => {
    e.target.disabled = true;
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    // playAnimations[1]();
    playAnimations[Math.floor(Math.random() * playAnimations.length)]();
}
eid("play-button").onmouseover = (e) => {
    setTimeout(() => {
    }, 1000);
    e.target.classList.add("play-button-hover");
    // e.target.animate([
    //     { boxShadow: '0px 0px 100px white'},
    //     { boxShadow: '0px 0px 1000px white'},
    //     { boxShadow: '0px 0px 100px white'},
    // ], {
    //     duration: 500,
    //     iterations: 1,
    //     delay: 100,
    //     easing: 'ease-out',
    //     fill: 'forwards',
    // });
}
eid("play-button").onmouseout = (e) => {
    e.target.classList.remove("play-button-hover");
}
resetPlay();
clearPlay();
clearPlayScreen();