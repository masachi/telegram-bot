/**
 * response:
 *         private Integer width;
 *
 *         private Integer height;
 *
 *         private String filename;
 *
 *         private Integer size;
 *
 *         private String hash;
 *
 *         private String url;
 *
 *         private String originUrl;
 *
 *         private String tgUrl;
 *
 */

const fs = require("fs");
const {uploadByBuffer} = require("../utils/upload");
const { uploadImageToGithub } = require('../utils/uploadToGithub')
const toArray = require("stream-to-array");
const sizeOf = require('image-size')
const crypto = require('crypto');


const CDN_DOMAIN_SUFFIX = "https://cdn.bronya.autos/api";
const IMG_DOMAIN_SUFFIX = "https://cdn.bronya.autos/api";

const uploadImage = async (file) => {
    let result = {}

    let filePath = file.filepath;
    let fileType = file.mimetype;
    let extension = file.originalFilename.toString().split(".").pop();

    let array = await toArray(fs.createReadStream(filePath))
    let buffer = Buffer.concat(array)

    let dimensions = sizeOf(buffer)

    console.error("文件Path", filePath);
    console.error("文件Type", fileType);

    console.error("文件大小", buffer.length);

    const uploadFileName = crypto.createHash('sha1').update(buffer).digest("hex");

    let uploadResult = await uploadImageToGithub(buffer, `${uploadFileName}.${extension}`)

    if(uploadResult?.code === 1) {
        throw new Error(JSON.stringify(uploadResult))
    }

    let fileName = uploadResult.path.replace("/file/", "");

    result['width'] = dimensions.width;
    result['height'] = dimensions.height;
    result['filename'] = fileName;
    result['size'] = file.size;
    result['hash'] = fileName.substring(0, fileName.lastIndexOf("."));

    result['url'] = `${CDN_DOMAIN_SUFFIX}${uploadResult.path}`;
    result['originUrl'] = `${IMG_DOMAIN_SUFFIX}${uploadResult.path}`;
    result['tgUrl'] = uploadResult.link;

    result['mimetype'] = fileType;

    return result;
}

module.exports = {
    uploadImage
}