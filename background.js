chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {


    function checkForVideo() {
        return document.querySelector("video");
    }

    if (changeInfo.status === 'complete' && tab.active && !tab.url.startsWith('chrome://')) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: checkForVideo
        }, (results) => {
            if (results && results.length > 0) {
                // console.log(results[0].result);
                // console.log('The page contains a video element.');
                const video_url = tab.url;
                if (video_url) {
                    chrome.tabs.sendMessage(
                        tabId,
                        {
                            type: "NEW_VIDEO",
                            video_url: tab.url,
                        }
                    )
                }
            }
        });
    }
});


let db;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.video && request.dataURL) {
        let openRequest = indexedDB.open(request.video, 1);
        openRequest.onupgradeneeded = function () {
            db = openRequest.result;
            if (!db.objectStoreNames.contains(request.video)) {
                db.createObjectStore(request.video, { autoIncrement: true });
            }
        }
        openRequest.onsuccess = function () {
            console.log("Database opened");
            db = openRequest.result;
            let transaction = db.transaction(request.video, 'readwrite');
            let store = transaction.objectStore(request.video);
            store.add(request.dataURL);
            console.log("Data added to database");
        }
        openRequest.onerror = function (event) {
            console.error("Error opening database", event.target.error);
        }
    } else {
        console.error("Invalid message format", request);
    }
});

