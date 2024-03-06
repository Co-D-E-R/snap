import getCurrentTab from "./helper/utils";
import Localbase from "localbase";
let db = new Localbase('ScreenshotDB');
import JSZip from "jszip";
import { saveAs } from "file-saver";
import '../static/popup.css';
import jsPDF from "jspdf";

let allImg;
let trim;


const ondel = () =>{
    const deleteDb = window.indexedDB.deleteDatabase('ScreenshotDB');
    deleteDb.onsuccess = function () {
        console.log('ScreenShot Database deleted');
    }
    deleteDb.onerror = function () {
        console.log('No database present');
    }

}
 
          






const onPdf =(allImg) =>{
    var doc = new jsPDF();
    allImg.map((image,ind)=>{
        
        let img= image[0];
        let index = image[1];
        let imgsrc = URL.createObjectURL(img);
        let pageWidth= doc.internal.pageSize.getWidth();
       
        doc.addImage(imgsrc, 'JPEG', 10, 10, pageWidth-20, 150,undefined,'FAST');

        let pageNumber = doc.internal.getNumberOfPages();
        doc.text(`page ${pageNumber}`, pageWidth-20,doc.internal.pageSize.getHeight() - 10);
        if(ind < allImg.length-1){
            doc.addPage();
        }
    })
    doc.save("image.pdf");
}

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
    const deleteContainer = document.getElementById(`container${index}`);
    deleteContainer.remove();
    // const imgElement = document.getElementById(`img${index}`);
    // imgElement.remove();
    db.collection(`${trim}`).doc({ id : index }).delete().then(() => {
        console.log("Image deleted");
    }).catch(error => {
        console.log("Image not deleted", error);
    });



}

function st(element, ...classes) {
    classes.forEach(cls => element.classList.add(cls));
  }



document.addEventListener('DOMContentLoaded', (event) => {
    const imageContainer = document.getElementsByClassName("imgContainer")[0];
   
    // var imgsrc = document.getElementsByClassName("img").src;

    const showImg = (allImg) => {
        allImg.map((image) => {
           let img= image[0];
           let index = image[1];

           const container= document.createElement("div");
           const btnContainer = document.createElement("div");

            const imgElement = document.createElement("img");
            const imgdownload = document.createElement("img");
            const imgDelete = document.createElement("img");


            container.id = `container${index}`;

            imgElement.id = `img${index}`;
            let imgsrc = URL.createObjectURL(img);
            imgElement.src = imgsrc;
            imgElement.style.width = "100px";
            imgElement.style.height = "100px";
            console.log(imgElement);
            container.appendChild(imgElement);
            

            //image download
            imgdownload.id = `imgdown`;
            imgdownload.src = chrome.runtime.getURL("./icons/download.png");
            btnContainer.appendChild(imgdownload);
            imgdownload.addEventListener("click",()=>{
                onDownload(imgsrc,index);
            });

            //image delete
            imgDelete.id = `imgDelete`;
            imgDelete.src = chrome.runtime.getURL("./icons/delete.png");
            btnContainer.appendChild(imgDelete);
            imgDelete.addEventListener("click",()=>{
                onDelete(index);
            });

            imageContainer.appendChild(container);
            container.appendChild(btnContainer);



            //styling image container
            st(container,'relative','flex','flex-col','items-center','justify-center','border','border-gray-300','rounded-md','p-2','mb-2');
            st(btnContainer,'flex','flex-row','justify-center','items-center','gap-2','mt-1');
            st(imgdownload,'h-6','w-6','cursor-pointer');
            st(imgDelete,'h-6','w-6','cursor-pointer');

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
        if(allImg){
            onZip(allImg);
        }
        
    })

    const pdfBtn = document.getElementById("pdf");
    pdfBtn.addEventListener("click",()=>{
      if(allImg){
            onPdf(allImg);
      }
       
    })

   const settingsBtn = document.getElementById("setting");
   const options = document.getElementById("optionBar");
   const dbBtn = document.getElementById("dbBtn");

    settingsBtn.addEventListener("click",()=>{
         options.classList.remove("hidden");
    });

    dbBtn.addEventListener("mouseout",()=>{
        options.classList.add("hidden");
    });

    dbBtn.addEventListener("click",()=>{
        ondel();
        options.classList.add("hidden");
        imageContainer.innerHTML = "";
    });
   





});





document.addEventListener("DOMContentLoaded", () => {

});