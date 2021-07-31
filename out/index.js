var core = require('@actions/core');
var github = require('@actions/github');
try {
    var fileExtensions = core.getInput('file-extensions');
    var style = core.getInput('style');
    var exclude_dirs = core.getInput('exclude-dirs');
    var token = core.getInput('token');
    var octokit = github.getOctokit(token);
    console.log("File Extensions: " + fileExtensions);
    console.log("Style: " + style);
    console.log("Exclude: " + exclude_dirs);
    console.log("token: " + style);
    console.log("========= CONTEXT ==========");
    console.log(github.context);
    console.log("========= issue ==========");
    console.log(github.context.issue);
    var data = octokit.rest.pulls.get({
        owner: github.context.issue.owner,
        repo: github.context.issue.repo,
        pull_number: github.context.issue.number,
    });
    console.log(data);
}
catch (error) {
    core.setFailed(error.message);
}
//# sourceMappingURL=index.js.map