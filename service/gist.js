const { Octokit, App } = require("octokit");

const GIST_TOKEN =
  process.env.GIST_TOKEN;

const octokit = new Octokit({
  auth: GIST_TOKEN,
});

updateGistByGistId = async (gist_id, content, fileName) => {
  let data = {
    description: "TG Bot上传了个图片",
    files: {},
  };
  data.files[fileName] = {
    content: content,
  };
  await octokit.request(`PATCH /gists/${gist_id}`, data);
};

appendGistByGistId = async (gist_id, appendContent, fileName) => {
  let content = await getContentByGistId(gist_id, fileName);
  let jsonContent = JSON.parse(content);

  jsonContent.push(appendContent);

  await updateGistByGistId(gist_id, JSON.stringify(jsonContent), fileName);
};

getContentByGistId = async (gist_id, fileName) => {
    const gistGetResponse = await octokit.request(`GET /gists/${gist_id}`);
    if(gistGetResponse.status === 200) {
        return gistGetResponse.data.files[fileName].content;
    }

    return "";
} 

// getContentByGistId("08237ee1dcf642b31f21b9eb95f3d17f", "test.json")

// appendGistByGistId("e656cf1235ecbdc44d058478ce14cc4c", "1111", "test.json");