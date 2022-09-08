const {uploadByUrl} = require("../utils/upload");
const {appendGistByGistId} = require("../service/gist");

const processPhotoMessage = async (ctx, message) => {
  if (message.photo && message.photo.length > 0) {
    message.photo.sort((a, b) => b.file_size || 0 - a.file_size || 0);
    if (message.photo[0]) {
      let uploadResponse = await uploadPhotoToTelegraph(ctx, message.photo[0]);
      await appendGistByGistId(process.env.GIST_ID, uploadResponse, process.env.FILE_NAME);
      return uploadResponse;
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
