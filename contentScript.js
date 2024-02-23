(() => {
    let player, controls;
    let current_video = "";

    //when message is received from background.js
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, video_url } = obj;

        if (type === "NEW_VIDEO") {
            current_video = video_url;
            newVideoLoaded();
        }

    })

    //when video get loaded

    const newVideoLoaded = () => {
        const buttonExit = document.getElementsByClassName("bookmark-btn")[0];
        if (!buttonExit) {
            const snapBtn = document.createElement("img");
            snapBtn.src = chrome.runtime.getURL("icons/snap.png");
            snapBtn.title = "ScreenShot";
            if (current_video.includes("youtube.com")) {
                if (!document.querySelector(".ytb-snap-btn")) {
                    snapBtn.className = "ytb-snap-btn";
                    controls = document.getElementsByClassName("ytp-left-controls")[0];
                    player = document.getElementsByClassName("video-stream")[0];
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
                    // console.log(player);
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

    //when snap button is clicked
    const addSnapHandler = () => {
        console.log("Snap button clicked");
        let canvas = document.createElement("canvas");
        canvas.width = player.videoWidth;
        canvas.height = player.videoHeight;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(player,0,0,canvas.width,canvas.height);
        let dataURL = canvas.toDataURL();
        let a = document.createElement("a");
        a.href = dataURL;
        a.download = "screenshot.png";
        a.click();
        a.remove();
        canvas.remove();

    }


})();