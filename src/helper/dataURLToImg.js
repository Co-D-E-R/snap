import { Buffer } from "buffer";
function dataURLToImg(dataURL){
   const parts = dataURL.split(';base64,');
   const type = parts[0].split(':')[1];
   const raw = Buffer.from(parts[1], 'base64').toString('binary');
   const rawLength = raw.length;
   const uInt8 = new Uint8Array(rawLength);
    for(let i = 0; i < rawLength; ++i) {
        uInt8[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8],{type:type});
}
export default dataURLToImg;
