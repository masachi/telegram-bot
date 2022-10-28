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
 */

const fs = require("fs");
const {uploadByBuffer} = require("../utils/upload");
const toArray = require("stream-to-array");

const uploadImage = async (filePath, fileType) => {
    let result = {}

    const array = await toArray(fs.createReadStream(filePath))
    const buffer = Buffer.concat(array)

    let uploadResult = await uploadByBuffer(buffer, fileType)

    console.error("uploadResult", uploadResult);
    result['']

    return result;
}

module.exports = {
    uploadImage
}