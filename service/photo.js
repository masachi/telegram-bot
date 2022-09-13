const {uploadByUrl} = require("../utils/upload");
const {appendGistByGistId} = require("../service/gist");

const processPhotoMessage = async (ctx, message) => {
  console.log("Photo Message", JSON.stringify(message));
  if (message.photo && message.photo.length > 0) {
    let uploadContent = [];
    for(let photoItem of message.photo) {
      let uploadResponse = await uploadPhotoToTelegraph(ctx, photoItem);
      uploadContent.push({
        ...photoItem,
        ...uploadResponse
      })
    }
    await appendGistByGistId(process.env.GIST_ID, uploadContent, process.env.FILE_NAME);
    return uploadContent[uploadContent.length - 1];
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
