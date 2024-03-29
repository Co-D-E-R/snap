import Localbase from "localbase";
import { Buffer } from "buffer";
import { v4 as uuidv4 } from 'uuid';


let db = new Localbase('ScreenshotDB');
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {


    // function checkForVideo() {
    //     return document.querySelector("video");
    // }

    if (changeInfo.status === 'complete' && tab.active && !tab.url.startsWith('chrome://')  && !tab.url.startsWith('https://chromewebstore.google.com/')) {

        chrome.tabs.get(tabId, function (tab) {
            if (chrome.runtime.lastError) {
                console.error('Tab does not exist:', chrome.runtime.lastError);
                return;
            }

            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['contentScript.bundle.js']
            }).then(() => {
                chrome.tabs.sendMessage(tabId, { type: "NEW_VIDEO", video_url: tab.url });
            }).catch((error) => {
                console.error('Error executing script:', error);
            });
        });

    }


});

function dataURLToImg(dataURL) {
    const parts = dataURL.split(';base64,');
    const type = parts[0].split(':')[1];
    const raw = Buffer.from(parts[1], 'base64').toString('binary');
    const rawLength = raw.length;
    const uInt8 = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
        uInt8[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8], { type: type });
}



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.video && request.dataURL) {
        const { video, dataURL } = request;
        const trim_url = video.split('&')[0];
        console.log(trim_url);



        const image = dataURLToImg(dataURL);

        db.collection(`${trim_url}`).add({
            id: uuidv4(),
            img: image
        }).then(() => {
            console.log('Image added to database');
        });

    } else {
        console.log('No video found');
    }

});


