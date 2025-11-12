
(async function() {
    "use strict";

    const checkBugButton = document.getElementById("checkBug");
    const result = document.getElementById("result");

    async function getLatestBugzillaURL() {
        const res = await fetch("https://bugzilla.mozilla.org/rest/bug?creation_time=2025-01-01&include_fields=id&order=bug_id%20DESC&limit=1");
        const data = await res.json();
        const bugId = data?.bugs?.[0]?.id;
        if (!bugId) {
            throw new Error("No bugs found");
        }

        console.log(bugId)

        return bugId;
    }

    async function updatePage() {
        const bugNumber = await getLatestBugzillaURL();

            const fragment = document.createDocumentFragment();

            const numberToGo = document.createElement("span");
            numberToGo.classList.add( "text-5xl", "font-black", "mb-4", "block")
            const calcNumber = 2000000 - bugNumber;
            numberToGo.textContent = `Only ${calcNumber} to go!`;

            const anchor = document.createElement("a")
            anchor.href = `https://bugzil.la/${bugNumber}`;
            anchor.target = "_blank"
            anchor.classList.add("block", "underline", "text-2xl")
            anchor.textContent = bugNumber;

            fragment.appendChild(numberToGo);
            fragment.appendChild(anchor);

            console.log(anchor, result)

            result.appendChild(fragment);
    }

    checkBugButton.addEventListener("click", async () => {
        try {

            result.innerHTML = "";
            await updatePage();

        } catch (err) {
            result.textContent = "Error fetching bug: " + err.message;
        }
    }, false);

    document.addEventListener("DOMContentLoaded", (event) => {
        updatePage();

        setTimeout(()=>{
            checkBugButton.classList.remove("opacity-0");
        }, 2000)

    });


})();