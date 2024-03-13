onmessage = function (e){
    var allImg = e.data;
    var allData = allImg.map((image, ind) => {
        let img= image[0];
        let index = image[1];
        let imgsrc = URL.createObjectURL(img);
        URL.revokeObjectURL(imgsrc);
        return {
            data: imgsrc,
            width: img.width,
            height: img.height
        };
    })
    postMessage(allData);
}