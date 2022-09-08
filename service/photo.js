const {uploadByUrl} = require("../utils/upload");
const {appendGistByGistId} = require("../service/gist");

const processPhotoMessage = async (ctx, message) => {
  if (message.photo && message.photo.length > 0) {
    message.photo.sort((a, b) => b.file_size || 0 - a.file_size || 0);
    if (message.photo[0]) {
      let uploadResponse = await uploadPhotoToTelegraph(ctx, message.photo[0]);
      appendGistByGistId("08237ee1dcf642b31f21b9eb95f3d17f", uploadResponse, "test.json");
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
