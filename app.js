
(async function() {
    "use strict";

    const result = document.getElementById("result");
    const lastUpdatedElement = document.getElementById("lastUpdated");
    let lastUpdateTime = null;

    function updateTimestamp() {
        lastUpdateTime = new Date();
        const hours = String(lastUpdateTime.getHours()).padStart(2, '0');
        const minutes = String(lastUpdateTime.getMinutes()).padStart(2, '0');
        const seconds = String(lastUpdateTime.getSeconds()).padStart(2, '0');
        const month = lastUpdateTime.toLocaleString('en-US', { month: 'short' });
        const date = lastUpdateTime.getDate();
        lastUpdatedElement.textContent = `Last updated at ${hours}:${minutes}:${seconds} on ${month} ${date}`;
    }

    async function getLatestBugzillaURL() {
        const res = await fetch("https://bugzilla.mozilla.org/rest/bug?creation_time=2025-01-01&include_fields=id&order=bug_id%20DESC&limit=1");
        const data = await res.json();
        const bugId = data?.bugs?.[0]?.id;
        if (!bugId) {
            throw new Error("No bugs found");
        }

        console.log(bugId)

        return 2000000;
        // return bugId;
    }

    function launchConfetti() {
        console.log("launchConfetti called");

        if (typeof confetti === 'undefined') {
            console.error("confetti is not loaded");
            return;
        }

        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);

        console.log("Confetti launched!");
    }

    async function updatePage() {
        const bugNumber = await getLatestBugzillaURL();
        console.log("Bug number:", bugNumber, "Check:", bugNumber >= 2000000);

            const fragment = document.createDocumentFragment();

            const numberToGo = document.createElement("span");
            numberToGo.classList.add( "text-5xl", "font-black", "mb-4", "block")
            const calcNumber = 2000000 - bugNumber;

            if (bugNumber >= 2000000) {
                console.log("2 million reached! Launching confetti...");
                numberToGo.textContent = "We hit 2 million bugs!";
                document.title = "2 Million Bugs Reached!";
                launchConfetti();
            } else {
                numberToGo.textContent = `Only ${calcNumber} to go!`;
                document.title = `${calcNumber} Bugs Remain`;
            }

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

    document.addEventListener("DOMContentLoaded", (event) => {
        launchConfetti();
        // updatePage();
        // updateTimestamp();
    });


})();