// blog
const pagepostlimit = pagelimit;
let pageidx = nullnum(pint(params.get("page")));
let postid =  nullnum(pint(params.get("post")));


const posts = [];


function clearblog(){
    log("clearing blog");
    eqa("#blog>*:not(#post-0), #blog-nav").forEach(el => el.remove());
}


function addpost(postsidx){
    // log(postsidx);
    const post = posts[postsidx];
    const postel = generatepost(post);
    
    app(eid("blog"), postel);
}

function dispposts(){
    for(let i = 0; i < posts.length; i++){
        addpost(i);
    }
}


function generatepost(post){
    const id = post.id || 0;
    const title = post.title || "TITLE";
    const desc = post.description || "DESC";
    const tags = post.tags || ["omg", "wow", "amazin"];
    const created = new Date(post.created_at) || new Date(0);
    const edited = new Date(post.edited_at) || new Date(0);
    // log(created.getTime(), edited.getTime(), edited);
    const cover = post.cover_url;
    const content = post.content || "AMAZING CONTENT";
    const wordcount = content.split(" ").length; // lazy but gets the job done heheheheheh
    
    const postel = mk("article", {class: "post", "data-id": id, id: `post-${id}`});
    const posth = mk("center", {class: "post-header", title: title});
    const postwc = mktxt("h6", `<<--|  ~${wordcount}±${(1-abs(Math.sin(wordcount)))
        .toFixed(randint(2,2))}-ish words  |-->>`, {class: "post-wordcount"});
    const postc = mktxt("p", content, {class: "post-content"});
    const postt = app(mk("h2", {class: "post-title"}), link(`?post=${id}`, title, "_self"));
    app(posth, postt);
    app(posth, mktxt("h3", desc, {class: "post-subtitle"}));
    const misc = mk("span", {class: "post-misc"});

    const dayms = 1000*60*60*24;
    const hasedited = (created.getTime() + dayms / 2) < edited.getTime();
    const datestr = created.toDateString() + (hasedited ? ` (${edited.toDateString()})` : "");
    appmany(misc, 
        [p(datestr), p(tags.join(" · ")), postwc]
    );

    postc.querySelectorAll("img").forEach(img => {
        imglazy(img);
    });
    
    app(posth, misc);
    app(postel, posth);
    app(postel, postc);
    return postel;
}


// todo: create blogwriting system that mimics helper.js functions so i dont have
// to write fully in html wow :o
/*
like:

text text yap yap yap

para(text yap yap yap

wowwwooiejfiejfiejdifjei

)
para(text yap yap yap)

would be: 
||||||||||||||||||||||||||||||||||||||||
<article>
text text yap yap yap

<p>text yap yap yap

wowwwooiejfiejfiejfeifjei

</p>
<p>text yap yap yap</p>




</article>


*/

let viewingmode = "page";


// pages ordered by descending id so flip ur head
function blogislast(){
    if(viewingmode === "post"){
        return postid === lastpostid;
    }
    else{
        return pageidx === 0;
    }
}
function blogisfirst(){
    if(viewingmode === "post"){
        return postid === minpostid;
    }
    else{
        return pageidx === floor((lastpostid - 1) / pagepostlimit);
    }
}
function placenav(){
        const nav = mk("nav", {id: "blog-nav"});
        const previous = mk("button", {id: "blog-previous", title: "older posts"});
        const next = mk("button", {id: "blog-next", title: "fresher posts"});
        if(!blogisfirst()){
            previous.innerText = `<<< older ${viewingmode}s`;
            previous.onclick = () => displayblog("previous");
        }
        if(!blogislast()){
            next.innerText = `fresher ${viewingmode}s >>>`;
            next.onclick = () => displayblog("next");
        }

        app(eid("blog"), appmany(nav, [previous, next]));
}


let editorinit = false;
let blogstate = 0; // 0 = hasnt fetched, 1 = fetching, 2 = fetched
eid("blog").innerHTML = "";
if(pageidx === null && postid === null)
    pageidx = 0;
if(pageidx === null)
    viewingmode = "post";

function displayblog(change = "none"){

    if(change !== "none")
        posts.length = 0;

    if(change === "previous"){
        if(blogisfirst()){
            throw new Error(`cant no more ${viewingmode} boi`);
        }
        if(viewingmode === "post"){
            postid--;
        }
        else{
            pageidx++;
        }
    }
    else if(change === "next"){
        if(blogislast()){
            throw new Error(`cant no more ${viewingmode} boi`);
        }
        if(viewingmode === "post"){
            postid++;
        }
        else{
            pageidx--;
        }
    }
    params.set(viewingmode, viewingmode === "post" ? postid : pageidx);


    clearblog();
    // const int = displayloading();

    setTimeout(() => {
        if(blogstate === 2) return;
        clearInterval(int);
        if(blogstate === 1) return;
        eid("blog-loading-txt").innerText = "loading is taking longer than usual...try reloading?";
        // add fail img
    }, blogttl);
    blogstate = 1;
    (viewingmode === "post" ? getpost(postid) : getpage(pageidx)).then(data => {
        posts.push(...data);
        dispposts();
        // window.location.href = "#blog";
        if(viewingmode === "post")
            window.location.href = `#post-${postid}`;
        else if(viewingmode === "page" && change !== "none")
            window.location.href = `#post-${posts[0].id}`;
        if(lastpostid === null){
            numposts().then(() => {
                placenav();
            });
        }
        else{
            placenav();
        }

    }).catch(error => {
        err(error);
        eid("blog").innerHTML += `<center>posts didnt load...maybe ${mkhtml("a", "reload?", {href: ""}) }
        <br>.₊̣̇.ಇ/ᐠˬ ͜   ˬ ᐟ\∫.₊̣̇.</center>`;
        blogstate = 0;
    }).finally(() => {
        blogstate = 2;
        // clearInterval(int);
        if(params.has("b-edit") && !editorinit){
            script("./scripts/blog-editor.js", true);
            editorinit = true;
        }
    });
}


const blogttl = 10000; // 10s


const bloadimgs = ["/assets/imgs/loadings/yveltal/loading.webp",];
const byayimg = "/assets/imgs/loadings/yveltal/success.webp";

let blogcnter = 0;


function displayloading(){
    // get fail later

    app(eid("blog"), app(mk("div", {id: "blog-loading"}), mktxt("h3", "loading posts...", {id: "blog-loading-txt"})));
    
    function instimg(){
        const clss = "blog-loading-img-" + blogcnter;
        prep(eid("blog-loading"), img(randarrchoose(bloadimgs), {class: clss}));
        return clss;
    }


    const int = setInterval(() => {

        const clss = "blog-loading-img-" + blogcnter;
        
        blogcnter++;
        instimg();

        new Ani(`.${clss}`)
            .then(() => {
                eq(`.${clss}`).style.rotate = "0deg"; // have to put as zero
            })
            .delay(1000)
            .rule({
                from: [{top: "0px", left: "0%", rotate: "0deg"}],
                to: [{top: "-100px", left: "10%", rotate: "20deg"}],
                duration: 400,
                easing: "ease-out",
                forwards: true,
                additive: [true, true],
            })
            .rule({
                from: [{top: "0px", left: "0%", opacity: 0, rotate: "0deg"}],
                to: [{top: "400px", left: "16%", opacity: -1, rotate: "60deg"}],
                duration: 1800,
                easing: "ease",
                forwards: true,
                additive: [true, true],
            })
            .then(() => {
                log("removing img");
                eq(`.${clss}`).remove();
            });

    }, 1900);
    return int;

}





displayblog("none");