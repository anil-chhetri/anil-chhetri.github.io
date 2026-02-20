$(document).ready(function () {
    const posts = []
    posts.push('https://raw.githubusercontent.com/anil-chhetri/DapperWithDotNet/main/README.md')
    posts.push('https://raw.githubusercontent.com/anil-chhetri/Miscellaneous/main/SQL%20Server/ExecutionPlan.md')
    posts.push('https://raw.githubusercontent.com/anil-chhetri/Miscellaneous/main/Delta%20Lake/Read%20and%20write%20Batch%20files.md')
    posts.push('https://raw.githubusercontent.com/anil-chhetri/Miscellaneous/main/DataWarehouse/Dimension.md')
    posts.push('https://raw.githubusercontent.com/anil-chhetri/Advanced-databricks-training/blob/main/introduction%20to%20streaming.md')


    reversePosts = posts.reverse()
    console.log(reversePosts)

    fetchMarkdownFiles(reversePosts);

    async function fetchMarkdownFiles(posts) {
        for (let post of posts) {
            const response = await fetch(`${post}`);
            if (response.ok) {
                const text = await response.text();
                const title = extractTitle(text);
                const postElement = createPostElement(post, title);
                $('#posts').append(postElement);
            } else {
                console.error(`Failed to load ${post}: ${response.statusText}`);
            }
        }
    }

    function extractTitle(markdown) {
        // Extract the first line as the title
        const lines = markdown.split('\n');
        return lines[0].replace(/^#\s*/, ''); // Remove the markdown header symbol
    }

    function createPostElement(post, title) {
        const postDiv = $('<div>').addClass('post card mb-4');

        postDiv.html(`
            <a href="post.html?post=${post}">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
            </div>
            </a>
        `);

        return postDiv;
    }
});
