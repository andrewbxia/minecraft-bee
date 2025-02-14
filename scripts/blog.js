const supaurl = "https://rvlvbcvqtwmliwwrgqjg.supabase.co";
// i have rls policies enabled, we should be goog goog
const apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2bHZiY3ZxdHdtbGl3d3JncWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MDU3MjcsImV4cCI6MjA1NTA4MTcyN30.oysqGbhO9qgDl9RogWjpwAkgY7-letEY_sIR0WYIP4s";

async function getpostsoverview(){
    const response = await fetch(`${supaurl}/rest/v1/posts?select=title,id,description,tags,cover_url&order=created_at.desc&limit=5`, {        headers: {
            apikey: apikey,
            "Authorization": `Bearer ${apikey}`,
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    console.log(data);
    return data;
}

getpostsoverview().then(posts => {
    console.log(posts);
});

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
const editorspace = eid("editor-output");
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
        const indentation = line.match(/^\s*/)[0]; // Get leading whitespace
        editor.insert(`\n${indentation}<br>\n${indentation}`);
    }
});