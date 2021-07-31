var core = require('@actions/core');
var github = require('@actions/github');
try {
    var fileExtensions = core.getInput('file-extensions');
    var style = core.getInput('style');
    var exclude_dirs = core.getInput('exclude-dirs');
    console.log("File Extensions: " + fileExtensions);
    console.log("Style: " + style);
    console.log("Exclude: " + exclude_dirs);
    console.log("token: " + style);
    console.log("========= CONTEXT ==========");
    console.log(github.context);
    console.log("========= PR ==========");
    console.log(github.context.issue.pull_request);
}
catch (error) {
    core.setFailed(error.message);
}
//# sourceMappingURL=index.js.map