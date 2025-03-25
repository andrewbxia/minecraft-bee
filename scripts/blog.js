const blogcontent = eq("#main-content #blog-content");
const onekosrc = `../scripts/oneko.js`;

function loadoneko(){
    const script = document.createElement("script");
    script.src = onekosrc;
    script.setAttribute("data-cat", "../assets/imgs/oneko.gif");
    document.body.appendChild(script);
}

function todate(date){
    return new Date(date).toUTCString().substring(0, 16);
}

function datedesc(createdat, editedat){
    return `posted ${createdat} ${editedat > createdat ? `(edited ${editedat})` : ""}`;
}

function generatedesc(desc, tags, createdat = "", editedat = ""){
    const container = mk("div");
    const list = mk("ul", {class: "b-info"});

    if(createdat) app(list, mktxt("li", datedesc(createdat, editedat), {class: "b-date"}));
    if(desc) app(list, mktxt("li", desc, {class: "b-desc"}));
    if(tags.length != 0) app(list, mktxt("li", tags.join(", #"), {class: "b-tags"}));
    
    app(container, list);
    return container;
}
function generateoverview(title, id, desc, tags, createdat, editedat){
    const container = mk("div");
    container.className = "b-entry";
    title = app(mk("span", {class: "b-main-row"}), app(mk("h2"), link(`/blog?id=${id}`, title, "_top", {class: "b-title"})));

    const date = p(`posted ${createdat}`);
    if(editedat > createdat) date.innerText+= `(edited ${editedat})`;
    date.className = "date-desc";
    app(title, date);
    app(container, title);
    
    
    //app(container, );
    app(container, generatedesc(desc, tags, "", ""));
    return container;
    // <p class="b-date">posted ${createdat}</p>

}

function loadid(){
    loadoneko();
    const postid = params.get("id");
    if(!isnum(postid)){
        window.location.href = "/blog";
    }

    function disperror(errmsg){
        blogcontent.innerHTML = `<h1>woops</h1>
        <p>${errmsg}</p>`;
    }

    async function getpost(){
        const response = await fetch(`${supaurl}/rest/v1/posts?id=eq.${postid}`, {
            headers: {
                apikey: publicanonkey,
                "Authorization": `Bearer ${publicanonkey}`,
                "Content-Type": "application/json"
        }
        })
        .then(res => res.json())
        .catch(error => {
            err(error);
            disperror(err.message);
            return null;
        });
        log(response);
        return response;
    }
    getpost().then(post=>{
        if(post === null || post.length === 0){
            disperror("cant find post of id "+postid);
            return;
        }
        post = post[0];
        console.log(post);
        const id = post.id;
        const createdat = post.created_at;
        const editedat = post.edited_at;
        const content = post.content;
        const coverurl = post.cover_url;
        const title = post.title;
        const tags = post.tags;
        const description = post.description;
        
        eid("post-desc").appendChild(generatedesc(description, tags, todate(createdat), todate(editedat)));
        blogcontent.innerHTML = content;
        // console.log(blogcontent);
        document.dispatchEvent(new Event("req_resize"));
    });
}

function loadoverview(){
    getpostsoverview().then(posts => {
        blogcontent.innerHTML = "";
        posts.forEach(post => {
            const id = post.id;
            let createdat = post.created_at;
            let editedat = post.edited_at;
            const content = post.content;
            const coverurl = post.cover_url;
            const title = post.title;
            const tags = post.tags;
            const desc = post.description;

            const edited = editedat > createdat;

            createdat = todate(createdat);
            editedat = todate(editedat);


            const blog = document.createElement("div");
            blog.className = "b-entry";

            blog.innerHTML = `
            <span class="b-head">
                <a href="/blog?id=${id}" target="_top">${title}</a>
                <p class="b-date">posted ${createdat}</p>
            </span>
            <ul>
                ${desc ? `<li>${desc}</li>` : ""}
                ${tags.length != 0 ? `<li class="b-tags">${tags.join(', ')}</li>` : ""}
            </ul>
            `;
            log(blog.innerHTML);
            blogcontent.appendChild(generateoverview(title, id, desc, tags, createdat, editedat));
        });
        // blogcontent.appendChild(ul);
        document.dispatchEvent(new Event("googies_loaed"));

    }).catch((error)=>{
        disperror(error.message);
    });
}

if(params.has("id")){
    loadid()
    
}
else{
    loadoverview();
}