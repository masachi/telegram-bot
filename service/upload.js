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
const Jimp = require('jimp');

Jimp.deflateStrategy(2);

const CDN_DOMAIN_SUFFIX = "https://cdn.cv3sarato.ga/api";
const IMG_DOMAIN_SUFFIX = "https://cdn.cv3sarato.ga/api";

const uploadImage = async (file) => {
    let result = {}

    let filePath = file.filepath;
    let fileType = file.mimetype;

    let array = await toArray(fs.createReadStream(filePath))
    let buffer = Buffer.concat(array)

    let dimensions = sizeOf(buffer)

    console.error("文件Path", filePath);
    console.error("文件Type", fileType);
    console.error("原始文件大小", buffer.length);

    if (buffer.length >= 5 * 1024 * 1024 || (dimensions.width * dimensions.height) > (4200*5000)) {
        console.error("文件处理....")

        let imageProcessor = await Jimp.read(filePath);

        if(buffer.length >= 5 * 1024 * 1024) {
          console.error("压缩中....")
          if(mimetype === 'image/png') {
            imageProcessor = imageProcessor.deflateLevel(3);
          }
          
          if(mimetype === 'image/jpeg') {
             imageProcessor = imageProcessor.quality(80); 
          }
        }

        if((dimensions.width * dimensions.height) > (4200*5000)) {
          console.error("缩放中....")

          let ratio = (4200 * 5000) / (dimensions.width * dimensions.height);

          imageProcessor = imageProcessor.resize(
            dimensions.width * ratio,
            dimensions.height * ratio
          );
        }

        console.error("写入处理完的文件....")
        await imageProcessor.writeAsync(filePath)
    }

    array = await toArray(fs.createReadStream(filePath))
    buffer = Buffer.concat(array)

    dimensions = sizeOf(buffer)

    console.error("处理后文件Path", filePath);
    console.error("处理后文件大小", buffer.length);

    let uploadResult = await uploadByBuffer(buffer, fileType)

    if(uploadResult?.code === 1) {
        return uploadResult;
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