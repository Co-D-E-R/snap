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