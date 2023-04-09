const fetch = require('node-fetch')

const downloadImageFromUrl = async (imageUrl) => {
  // Make a request to the URL and wait for the response
  const response = await fetch(imageUrl);

  // Get the response body as a buffer
  const buffer = await response.buffer();

  // Return the buffer
  return buffer;
};

module.exports = {
    downloadImageFromUrl
}