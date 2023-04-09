const stream = require('stream')

const fetch = require('node-fetch')
const FormData = require('form-data')

const toArray = require('stream-to-array')
const { uploadImageToGithub } = require('./uploadToGithub')

const uploadByUrl = (url) => {
  console.log("获取图片....." + url);
  return fetch(url)
    .then(async (r) => {
      if (!(r.body instanceof stream.Stream)) {
        throw new TypeError('Response is not a stream')
      }
      const array = await toArray(r.body)
      const buffer = Buffer.concat(array)

      if (!r.headers.get('content-type')) {
        throw new Error('No content types in the response')
      }

      return uploadByBuffer(buffer, r.headers.get('content-type'), agent)
    })
}

const uploadByUrlAndFileName = (url, fileName) => {
  console.log("获取图片....." + url);
  const extension = url.toString().split('.').pop();
  return fetch(url)
    .then(async (r) => {
      if (!(r.body instanceof stream.Stream)) {
        throw new TypeError('Response is not a stream')
      }
      const array = await toArray(r.body)
      const buffer = Buffer.concat(array)

      if (!r.headers.get('content-type')) {
        throw new Error('No content types in the response')
      }

      return uploadImageToGithub(buffer, `${fileName}.${extension}`);
    })
}

const uploadByBuffer = (buffer, contentType, agent) => {
  console.log("上传到telegraph上.....")
  if (!Buffer.isBuffer(buffer)) {
    throw new TypeError('Buffer is not a Buffer')
  }
  const form = new FormData()

  form.append('photo', buffer, {
    filename: 'blob',
    contentType,
    ...agent && {agent},
  })

  return fetch('https://telegra.ph/upload', {
    method: 'POST',
    body: form
  })
    .then(result => {
      console.error("telegraf upload response: ", result);
      return result.json()
    })
    .then((result) => {
      if (result.error) {
        return {
          code: 1,
          error: error
        }
      }

      if (result[0] && result[0].src) {
        return {
          code: 0,
            ...result[0],
          link: 'https://telegra.ph' + result[0].src,
          path: result[0].src,
        }
      }

      throw new Error('Unknown error')
    })
    .catch((error) => {
      console.error("上传到telegraph发生错误： ", error);
      return {
        code: 1,
        error: error
      }
    })
}

module.exports = {
  uploadByUrl,
  uploadByBuffer,
  uploadByUrlAndFileName
}