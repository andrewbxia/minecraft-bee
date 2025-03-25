const samplepost = `
<!--
<h1>Sample Blog Post</h1>
<h2>Introduction</h2>
<p>This is a sample blog post to demonstrate various HTML tags.</p>
<h2>Content</h2>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. <abbr title="Hypertext Markup Language">HTML</abbr> is the standard markup language for creating web pages.</p>
<h3>Subheading</h3>
<p>Here is a list of items:</p>
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>
<p>Here is a link to <a href="https://www.example.com">example.com</a>.</p>
<h2>Conclusion</h2>
<p>Thank you for reading this sample post. Feel free to use these tags in your own posts.</p>

-->

.
`;

const editorhtml = `
<section id="blog-writing">
    <div id="blog-editor"></div>
    <div id="editor-output"></div>
</section>
<div id="slider"></div>
`;
let blogwriting, slider;
let dragging = false;
let editing = false;
// const slider = eid("slider");
// params already defined

if (params.has("b-edit")){
    editing = true;
    eid("main").style.width = "100%";
    const aceurls = [
        "../scripts/ace-min-noconflict/ace.js",
        "../scripts/ace-min-noconflict/ext-language_tools.js",
        "../scripts/ace-min-noconflict/ext-spellcheck.js",
        "../scripts/ace-min-noconflict/ext-beautify.js"
    ];

    let numloaded = 0;
    console.log(eid("main").innerHTML);

    eid("main").innerHTML = editorhtml + eid("main").innerHTML;
    console.log(eid("main").innerHTML);
    blogwriting = eid("blog-writing");
    eid("blog-writing").style.flexGrow = 1;
    eid("main-content").style.flexGrow = 0;
    slider = eid("slider");
    slider.addEventListener("mousedown", (event) => {
        dragging = true;
        slider.style.cursor = "grabbing";
    });
    
    document.addEventListener("mousemove", (event) => {
        if (dragging) {
            const mainwidth = parseFloat(getComputedStyle(eid("main")).width);
            // log(mainwidth)
            
            // console.log(event.clientX)
            // slider.style.left = `${event.clientX}px`;
            eid("main-content").style.width = `${mainwidth - (event.clientX - 15/2 + 60)}px`; // 30 padding
            // blogwriting.style.width = `${event.clientX-15/2}px`;
        }
    });
    
    document.addEventListener("mouseup", () => {
        dragging = false;
        slider.style.cursor = "ew-resize";
    });

    aceurls.forEach(url =>{
        const script = document.createElement("script");
        script.src = url;
        script.onload = () =>{
            numloaded++;
            if(numloaded === aceurls.length){
                initediting();
            }
        };
        document.head.appendChild(script);
    });
}
function initediting() {
    ace.require("ace/ext/language_tools");
    ace.require("ace/ext/spellcheck");
    const beautify = ace.require("ace/ext/beautify");
    const editor = ace.edit("blog-editor");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        useSoftTabs: true,
        fontSize: "24px",
        spellcheck: true,
        tabSize: 8,
    });
    const editorspace = eid("blog-content");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/html");
    editor.setValue(samplepost);
    beautify.beautify(editor.session);

    const doc = editor.session.getDocument();
    doc.on("change", () => {
        editorspace.innerHTML = editor.getValue();
    });

    // extra commands curated by chatgpt :)
    editor.commands.addCommand({
        name: "instBrEnter",
        bindKey: { win: "Ctrl+Enter" },
        exec: function(editor) {
            const session = editor.getSession();
            const cursor = editor.getCursorPosition();
            const line = session.getLine(cursor.row);
            const indentation = line.match(/^\s*/)[0]; // get leading whitespace
            editor.insert(`\n${indentation}<br>\n${indentation}`);
        }
    });
}


window.addEventListener("beforeunload", (event) => {
    if(editing){
        event.returnValue = "SAVE SAVE SAVE";
        return "SAVE SAVE SAVE";
    }
});