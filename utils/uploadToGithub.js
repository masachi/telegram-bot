const { Octokit } = require("octokit");

const uploadImageToGithub = async (buffer, remoteFileName) => {
    // create an instance of Octokit with your access token
    const octokit = new Octokit({
        auth:
            process.env.REPO_TOKEN
    });

    // define the repository owner, name, and branch
    const owner = process.env.GITHUB_USERNAME;
    const repo = process.env.REPO_NAME;
    const branch = "main";

    // create the content for the new file
    const content = buffer.toString("base64");

    // define the file path and commit message
    const path = `${remoteFileName?.substring(0, 2)}/${remoteFileName}`;
    const message = "Upload Images By Telegram Bot";


    // create the file using the GitHub API
    return octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content,
        branch,
    })
        .then((response) => {
            return {
                code: 0,
                link: response?.data?.content?.html_url,
                name: response?.data?.content?.name,
                // path: response?.data?.content?.path,
                path: `/file/${remoteFileName}`,
            };
        })
        .catch((error) => {
            //   console.error("Error uploading file: ", error);
            return {
                code: 1,
                error: error,
            };
        });
};


module.exports = {
    uploadImageToGithub
}