const {uploadByUrl} = require("../utils/upload");
const {appendGistByGistId} = require("../service/gist");
const { v4: uuidv4 } = require('uuid');

const processPhotoMessage = async (ctx, message) => {
  console.log("Photo Message", JSON.stringify(message));
  if (message.photo && message.photo.length > 0) {
    let waitForUploadCount = 0;
    let uploadContent = [];
    let id = uuidv4();
    for(let photoItem of message.photo) {
      let uploadResponse = await uploadPhotoToTelegraph(ctx, photoItem);
      if(uploadResponse?.link) {
        uploadContent.push({
          id: id,
          ...photoItem,
          ...uploadResponse
        });
        waitForUploadCount++;
      }
    }
    if(waitForUploadCount === message.photo.length) {
      await appendGistByGistId(process.env.GIST_ID, uploadContent, process.env.FILE_NAME);
      return uploadContent[uploadContent.length - 1];
    }
    else {
      console.log("这条消息对应图片存在上传错误，请重新上传");
    }
  }

  return {
    link: "",
    path: "",
  };
};

const uploadPhotoToTelegraph = async (ctx, photo) => {
  const currentFileLink = await ctx.telegram.getFileLink(photo.file_id);
  const uploaded = await uploadByUrl(currentFileLink);
  return uploaded;
};

module.exports = { processPhotoMessage };
