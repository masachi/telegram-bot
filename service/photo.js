const {uploadByUrl} = require("../utils/upload");

const processPhotoMessage = async (ctx, message) => {
  if (message.photo && message.photo.length > 0) {
    message.photo.sort((a, b) => b.file_size || 0 - a.file_size || 0);
    if (message.photo[0]) {
      return await uploadPhotoToTelegraph(ctx, message.photo[0]);
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
