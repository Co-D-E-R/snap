(() => {

    let player, controls;
    let current_video = "";
    let dataURL = "";
   

    //when message is received from background.js
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, video_url } = obj;

        if (type === "NEW_VIDEO") {
            current_video = video_url;
            newVideoLoaded();

        }

    })

    //when video get loaded

    const newVideoLoaded = async() => {
     
        const buttonExit = document.getElementsByClassName("bookmark-btn")[0];
        if (!buttonExit) {
            const snapBtn = document.createElement("img");
            snapBtn.src = chrome.runtime.getURL("./icons/snap.png");
            snapBtn.style.width = "40px";
            snapBtn.style.height = "40px";



            snapBtn.title = "ScreenShot";
            if (current_video.includes("youtube.com")) {
                if (!document.querySelector(".ytb-snap-btn")) {
                    snapBtn.className = "ytb-snap-btn";
                    controls = document.getElementsByClassName("ytp-left-controls")[0];
                    player = document.getElementsByClassName("video-stream")[0];
                    controls?.appendChild(snapBtn);
                    snapBtn.addEventListener("click", addSnapHandler);
                }




            } else if (current_video.includes("primevideo.com")) {
                if (!document.querySelector(".prime-snap-btn")) {
                    snapBtn.className = "prime-snap-btn";
                    controls = document.getElementsByClassName("player-overlay")[0];
                    player = document.getElementsByTagName("video")[0];
                    controls.appendChild(snapBtn);
                    snapBtn.addEventListener("click", addSnapHandler);
                }
            } else {
                // console.log("not youtube");
                snapBtn.className = "snap-btn";

                async function waitForVideoLoad() {
                    return new Promise(resolve => {
                        const interval = setInterval(() => {
                            player = document.getElementsByTagName("video")[0];
                            if (player) {
                                clearInterval(interval);
                                resolve(player);
                            }

                        }, 1000);
                    })
                }
                waitForVideoLoad().then(player => {
                    console.log(player);
                    let parent = player.parentNode;
                    snapBtn.style.position = "absolute";
                    snapBtn.style.top = "0";
                    snapBtn.style.right = "0";
                    snapBtn.style.width = "50px";
                    snapBtn.style.height = "50px";
                    snapBtn.style.zIndex = "1000";
                    parent.appendChild(snapBtn);
                    snapBtn.addEventListener("click", addSnapHandler);
                });

            }
        }
    }

    


    const addSnapHandler = () => {
        let port;
        try {
            port = chrome.runtime.connect({ name: "my-connection" });
        } catch (error) {
            console.error("Error connecting to port:", error);
            return;
        }

        port.onDisconnect.addListener(function () {
            // Handle disconnect here
            // console.log("Disconnected");
            port = null;
        });
        if (!port) {
            try {
                port = chrome.runtime.connect({ name: "my-connection" });
            } catch (error) {
                console.error("Error reconnecting to port:", error);
                return;
            }
        }

        // console.log("Snap button clicked");
        let canvas = document.createElement("canvas");
        canvas.width = player.videoWidth;
        canvas.height = player.videoHeight;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(player, 0, 0, canvas.width, canvas.height);
        dataURL = canvas.toDataURL();
      
        if (dataURL && port) {
            try {
                chrome.runtime.sendMessage({ dataURL: dataURL, video: current_video });
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }

    }

  
    document.addEventListener('DOMContentLoaded', (event) => {
        const targetNode = document.querySelector('video');
        if (!targetNode) {
            console.error('No video element found');
            return;
        }
    
        const config = { attributes: true, childList: true, subtree: true };
        const callback = function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    newVideoLoaded();
                }
            }
        };
    
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    });





})();