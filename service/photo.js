const {uploadByUrl} = require("../utils/upload");
const {appendGistByGistId} = require("../service/gist");

const processPhotoMessage = async (ctx, message) => {
  console.log("Photo Message", JSON.stringify(message));
  if (message.photo && message.photo.length > 0) {
    let uploadContent = {};
    uploadContent[message.photo[0].file_unique_id] = [];
    for(let photoItem of message.photo) {
      let uploadResponse = await uploadPhotoToTelegraph(ctx, photoItem);
      if(uploadContent[photoItem.file_unique_id]) {
        uploadContent[photoItem.file_unique_id].push({
          ...photoItem,
          ...uploadResponse
        }) 
      }
      else {
        uploadContent[photoItem.file_unique_id] = [{
          ...photoItem,
          ...uploadResponse
        }]
      }
    }
    await appendGistByGistId(process.env.GIST_ID, uploadContent, process.env.FILE_NAME);
    return uploadContent[message.photo[0].file_unique_id][uploadContent.length - 1];
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
