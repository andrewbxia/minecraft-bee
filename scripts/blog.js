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
let blogloadcnt = -1;
eid("blog").innerHTML = "";
if(pageidx === null && postid === null)
    pageidx = 0;
if(pageidx === null)
    viewingmode = "post";

function displayblog(change = "none", delay = 0){
    blogstate = 0;
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


    blogstate = 1;
    clearblog();
    blogloadcnt++;
    dispblogload();

    if(viewingmode === "post")
        window.location.href = "#blog";
    else if(viewingmode === "page" && change !== "none")
        window.location.href = "#blog";
    setTimeout(() => {
        (viewingmode === "post" ? getpost(postid) : getpage(pageidx)).then(data => {
            posts.push(...data);
            dispposts();
            // if(viewingmode === "post")
            //     window.location.href = `#post-${postid}`;
            // else if(viewingmode === "page" && change !== "none")
            //     window.location.href = `#post-${posts[0].id}`;
            if(lastpostid === null){
                numposts().then(() => {
                    placenav();
                });
            }
            else{
                placenav();
            }
            dispblogyay();
            blogstate = 2;
        }).catch(error => {
            err(error);
            eid("blog").innerHTML += `<center style="margin-top:350px;">posts didnt load...maybe ${mkhtml("a", "reload?", {href: ""}) }
            <br>.₊̣̇.ಇ/ᐠˬ ͜   ˬ ᐟ\∫.₊̣̇.</center>`;
            blogstate = 0;
            // addblogloadimg(blogstate);
        }).finally(() => {
            document.dispatchEvent(new Event("blogloaded"));
            if(params.has("b-edit") && !editorinit){
                script("./scripts/blog-editor.js", true);
                editorinit = true;
            }
        });
    }, delay)
}


const blogttl = 5000; // 5s
const blogimglifetime = 1900;

const bloadimgs = ["/assets/imgs/loadings/yveltal/loading.webp",];
const byayimg = "/assets/imgs/loadings/yveltal/success.webp";
[byayimg, ...bloadimgs].forEach(src => { // preload imgs
    const img = new Image();
    img.src = src;
});

const bnayimg = "";
let bimgid = 0;

const bimgdelay = blogimglifetime;
const bloadtimes = [() => 0,
    () => elprop(eid("blog-loading"), "--b-load-1-time") * 1000,
    () => elprop(eid("blog-loading"), "--b-load-2-time") * 1000];

    

function addblogloadimg(state = 1, first = false){
    const clss = "b-load-" + state + (first ? " first" : "");
    const yay = state === 2 ? 1 : 0;
    const lifetime = bloadtimes[state]() + (state === 1) * bimgdelay;
    const imgsrc = 
        state === 0 ? 
        //  ""
            randarrchoose(bloadimgs)
        : state === 1 ? 
            randarrchoose(bloadimgs)
        : state === 2 ? 
            byayimg
        : "bruh";

    const loadimgid = `b-load-img-${bimgid++}`;
    const loadimg = img(imgsrc, {class: clss, id: loadimgid});
    if(yay)
        app(eid("blog-loading"), loadimg);
    else prep(eid("blog-loading"), loadimg);
    setTimeout(() => {
        eid(loadimgid)?.remove();
    }, lifetime);
    attachdebug(
        state
    );
    return lifetime;
}


function dispblogload(){
    // get fail later
    if(!eid("blog-loading"))
        app(eid("blog"), app(mk("div", {id: "blog-loading"}), mktxt("h3", "loading posts...", {id: "blog-loading-txt"})));

    addblogloadimg(blogstate, true);
    const cnt = blogloadcnt;

    const int = setInterval(() => {
        if(blogstate === 2 || cnt !== blogloadcnt){
            clearInterval(int);
            dlog("detected stopping", blogstate, cnt, blogloadcnt);
            setTimeout(() => {
                if(cnt !== blogloadcnt) return; // loaded, do cnt + 1
                dlog("removing loading", cnt);
                eid("blog-loading").remove();

            }, bloadtimes[2]() + 1000); // lag compensation
            return;
        }
        
        addblogloadimg(blogstate);
    }, blogimglifetime);

    setTimeout(() => {
        if(cnt !== blogloadcnt) return;
        if(blogstate === 2) return;
        // clearInterval(int);
        // if(blogstate === 1) return;
        eid("blog-loading-txt").innerText = "loading is taking longer than usual...try reloading?";
        document.dispatchEvent(new Event("blogloaded")); // preemptively do it to init pretty bg bars
        // add fail img
    }, blogttl);
}

function dispblogyay(){
    // yay blog load wow omg

    addblogloadimg(2);
    let has1 = false;
    eqa("#blog-loading>img.b-load-1").forEach(el => {
        el.remove();
        has1 = true;
    });
    if(has1) addblogloadimg(1, true);

    eid("blog-loading").classList.add("yay");

    eid("blog-loading-txt").innerText = "loaded! yay yyaay";
    eid("blog-loading-txt").classList.add("yay"); // init immediately
}



displayblog("none", 0);