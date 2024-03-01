import getCurrentTab from "./helper/utils";
import Localbase from "localbase";
let db = new Localbase('ScreenshotDB');
import JSZip from "jszip";
import { saveAs } from "file-saver";

let allImg;
let trim;

const onZip=(allImg) => {
    var zip = new JSZip();
    var imageZip = "imageZip.zip";

    allImg.map((image) => {
       let img = image[0];
       let index = image[1];
        zip.file(`image${index}.png`, img, { base64: true });
    });
    zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, imageZip);
    });
}

const onDownload = (img,index) => {
    let a = document.createElement("a");
    a.href = img;
    a.download = `image${index}.png`;
    a.click();
    a.remove();

}

const onDelete = (index) =>{
    const imgElement = document.getElementById(`img${index}`);
    imgElement.remove();
    db.collection(`${trim}`).doc({ id : index }).delete().then(() => {
        console.log("Image deleted");
    }).catch(error => {
        console.log("Image not deleted", error);
    });



}



document.addEventListener('DOMContentLoaded', (event) => {
    const imageContainer = document.getElementsByClassName("imgContainer")[0];
    // var imgsrc = document.getElementsByClassName("img").src;

    const showImg = (allImg) => {
        allImg.map((image) => {
           let img= image[0];
           let index = image[1];
            const imgElement = document.createElement("img");
            const imgdownload = document.createElement("button");
            const imgDelete = document.createElement("button");

            imgElement.id = `img${index}`;
            let imgsrc = URL.createObjectURL(img);
            imgElement.src = imgsrc;
            imgElement.style.width = "100px";
            imgElement.style.height = "100px";
            console.log(imgElement);
            imageContainer.appendChild(imgElement);
            

            //image download
            imgdownload.id = `imgdown`;
            imgdownload.innerHTML = "DOWN";
            imageContainer.appendChild(imgdownload);
            imgdownload.addEventListener("click",()=>{
                onDownload(imgsrc,index);
            });

            //image delete
            imgDelete.id = `imgDelete`;
            imgDelete.innerHTML = "DELETE";
            imageContainer.appendChild(imgDelete);
            imgDelete.addEventListener("click",()=>{
                onDelete(index);
            });

        })

    }
    let url;
    getCurrentTab().then(res => {
        url = res;
        trim = url.split('&')[0];
        if (trim) {
            db.collection(`${trim}`).get().then(users => {
                if (users.length === 0) {
                    console.log("No image found");
                } else {
                     allImg = users.map(user => {
                        return [user.img, user.id];

                     });
                    showImg(allImg);
                }

            }).catch(error => {
                console.log("No image",error);
            });

        } else {
            console.log("error", error);
        }
    }).catch(error => {
        console.log("Tab not found",error);
    });

    const downloadBtn = document.getElementById("download");
    downloadBtn.addEventListener("click",()=>{
        onZip(allImg);
       
    })



});





document.addEventListener("DOMContentLoaded", () => {

});