$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postName = urlParams.get('post');



    fetchPost(postName);

    


    async function fetchPost(post) {
        const response = await fetch(`${post}`);
        if (response.ok) {
            const text = await response.text();
            const hasTOC = text.includes('## Table of Contents');
            const toc = hasTOC ? '' : generateTOC(text);
            $('#post-content').append(formatContent(toc));
            const title = extractTitle(text);
            $('#post-title').text(title);
            $('#post-content').append(formatContent(text));
            
            AddCopyButtonToCodeSection()
            
        } else {
            console.error(`Failed to load post: ${response.statusText}`);
        }
    }


    function AddCopyButtonToCodeSection()
    {
        const codeBlocks = document.querySelectorAll("[class^=language]");
        console.log(codeBlocks)
        Array.from(codeBlocks).forEach(codeBlock => {
            const copyButton = document.createElement("button");
            // copyButton.textContent = "";
            copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
</svg>`
            copyButton.className = "copy-button";
            console.log('test')
            const codeContainer = codeBlock.parentElement;
            codeContainer.appendChild(copyButton);

        
            copyButton.addEventListener("click", function () {
                const textToCopy = codeBlock.textContent;
                navigator.clipboard.writeText(textToCopy).then(function () {
                    copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-all" viewBox="0 0 16 16">
  <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486z"/>
</svg>`
                copyButton.className = 'copy-button btn-success'
                }).catch(function (err) {
                    console.error("Failed to copy: ", err);
                });
            });
        });
    }

    function generateTOC(markdown) {
        const toc = [];
        const headings = markdown.match(/^(#{1,6})\s+(.*)$/gm);
    
        if (headings) {
            headings.forEach(heading => {
                const level = heading.match(/#/g).length; // Count the number of '#' for heading level
                const title = heading.replace(/^(#{1,6})\s+/, '').trim();
                const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                toc.push(`${' '.repeat((level - 1) * 2)}- [${title}](#${slug})`);
            });
        }
    
        return toc.length ? ['## Table of Contents', '', ...toc.map(item => `${item}`), ''].join('\n') : '';
    }

    function extractTitle(markdown) {
        const lines = markdown.split('\n');
        return lines[0].replace(/^#\s*/, ''); // Remove the markdown header symbol
    }

    function formatContent(markdown) {
        const sections = markdown.split(/^(#|##)\s+(.*)/gm); // Split by headers

        let content = '';
        for (let i = 1; i < sections.length; i += 3) {
            const headerLevel = sections[i].length; // Header level
            const header = sections[i + 1]; // Header text
            const paragraph = sections[i + 2] ? sections[i + 2].trim() : ''; // Associated content
            
            const hasTOC = content.includes('## Table of Contents');
            const toc = hasTOC ? '' : generateTOC(content);
            
            if (header) {
                content += `
                    <div class="card mb-3">
                        <div class="card-header">
                            <h${headerLevel} id=${header.toLowerCase().replace(/\s+/g, '-')} class="m-0">${header}</h${headerLevel}>
                        </div>
                        <div class="card-body">
                            ${marked.parse(paragraph)}
                        </div>
                    </div>`;
            }
        }

        return content;
    }

});
