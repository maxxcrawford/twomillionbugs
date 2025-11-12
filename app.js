
(async function() {
    "use strict";

    const checkBugButton = document.getElementById("checkBug");
    const result = document.getElementById("result");
    const lastUpdatedElement = document.getElementById("lastUpdated");
    const autoRefreshButton = document.getElementById("autoRefresh");
    let lastUpdateTime = null;
    let autoRefreshInterval = null;
    let autoRefreshEnabled = false;

    function updateTimestamp() {
        lastUpdateTime = new Date();
        const hours = String(lastUpdateTime.getHours()).padStart(2, '0');
        const minutes = String(lastUpdateTime.getMinutes()).padStart(2, '0');
        const seconds = String(lastUpdateTime.getSeconds()).padStart(2, '0');
        const month = lastUpdateTime.toLocaleString('en-US', { month: 'short' });
        const date = lastUpdateTime.getDate();
        lastUpdatedElement.textContent = `Last updated at ${hours}:${minutes}:${seconds} on ${month} ${date}`;
    }

    function toggleAutoRefresh() {
        autoRefreshEnabled = !autoRefreshEnabled;

        if (autoRefreshEnabled) {
            autoRefreshButton.classList.add('bg-green-500', 'text-white');
            autoRefreshButton.querySelector('span').textContent = '(ON)';

            autoRefreshInterval = setInterval(async () => {
                result.innerHTML = "";
                await updatePage();
                updateTimestamp();
            }, 5 * 60 * 1000);
        } else {
            autoRefreshButton.classList.remove('bg-green-500', 'text-white');
            autoRefreshButton.querySelector('span').textContent = '(OFF)';

            if (autoRefreshInterval) {
                clearInterval(autoRefreshInterval);
                autoRefreshInterval = null;
            }
        }
    }

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

            document.title = `${calcNumber} Bugs Remain`;
    }

    checkBugButton.addEventListener("click", async () => {
        try {

            result.innerHTML = "";
            await updatePage();
            updateTimestamp();

        } catch (err) {
            result.textContent = "Error fetching bug: " + err.message;
        }
    }, false);

    autoRefreshButton.addEventListener("click", toggleAutoRefresh);

    document.addEventListener("DOMContentLoaded", (event) => {
        updatePage();
        updateTimestamp();
    });


})();