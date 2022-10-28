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
const toArray = require("stream-to-array");
const sizeOf = require('image-size')

const CDN_DOMAIN_SUFFIX = "https://cdn.cv3sarato.ga/api";
const IMG_DOMAIN_SUFFIX = "https://cdn.cv3sarato.ga/api";

const uploadImage = async (file) => {
    let result = {}

    let filePath = file.filepath;
    let fileType = file.mimetype;

    const array = await toArray(fs.createReadStream(filePath))
    const buffer = Buffer.concat(array)

    let uploadResult = await uploadByBuffer(buffer, fileType)

    let fileName = uploadResult.path.replace("/file/", "");

    const dimensions = sizeOf(buffer)

    result['width'] = dimensions.width;
    result['height'] = dimensions.height;
    result['filename'] = fileName;
    result['size'] = file.size;
    result['hash'] = fileName.substring(0, fileName.lastIndexOf("."));

    result['url'] = `${CDN_DOMAIN_SUFFIX}${uploadResult.path}`;
    result['originUrl'] = `${IMG_DOMAIN_SUFFIX}${uploadResult.path}`;
    result['tgUrl'] = uploadResult.link;

    return result;
}

module.exports = {
    uploadImage
}