const { Octokit } = require("@octokit/core");
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

//const octokit = new Octokit({ auth: `personal-access-token123` });
/* 
const response = await octokit.request("GET /orgs/{org}/repos", {
  org: "octokit",
  type: "private",
});
 */

//https://docs.github.com/en/rest/branches/branches

//given a gitLink get all languages of all repos
async function getGitHubLanguages(gitLink) {
  //git link: https://github.com/saigonbitmaster/bWorksPublic
  let result = {};
  let languages = [];
  const [owner, repo] =
    gitLink.split("github.com/").length > 1
      ? gitLink.split("github.com/")[1].split("/")
      : null;

  const octokit = new Octokit({
    auth: GITHUB_TOKEN,
  });
  const repos = await octokit.request(`GET /users/${owner}/repos`, {
    org: owner,
  });

  for await (const item of repos.data) {
    let repoLanguages = await octokit.request(
      `GET /repos/${owner}/${item.name}/languages`,
      {
        owner: owner,
        repo: item.name,
      }
    );

    result[item.name] = repoLanguages.data;
    languages.push(...Object.keys(repoLanguages.data));
  }

  return { details: result, languages: [...new Set(languages)] };
}


module.exports = {getGitHubLanguages}