const blogcontent = eq("#main-content .blog-content");
const onekosrc = `../scripts/oneko.js`;

function todate(date){
    return new Date(date).toUTCString().substring(0, 16);
}

if(params.has("id")){
    const script = document.createElement("script");
    script.src = onekosrc;
    script.setAttribute("data-cat", "../assets/imgs/oneko.gif");
    document.body.appendChild(script);
    const postid = params.get("id");
    if(!postid){
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
        .catch(err => {
            console.error(err);
            disperror(err.message);
            return null;
        });
        console.log(response);
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
        
        blogcontent.innerHTML = content;
        // console.log(blogcontent);
        document.dispatchEvent(new Event("req_resize"));
    });
    
    
}
else{
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
            console.log(blog.innerHTML);
            blogcontent.appendChild(blog);
        });
        // blogcontent.appendChild(ul);
        document.dispatchEvent(new Event("googies_loaed"));

    });

}