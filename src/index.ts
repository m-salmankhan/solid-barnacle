const core = require('@actions/core');
const github = require('@actions/github');

try {
    const fileExtensions = core.getInput('file-extensions');
    const style = core.getInput('style');
    const exclude_dirs = core.getInput('exclude-dirs');
    console.log(`File Extensions: ${fileExtensions}`);
    console.log(`Style: ${style}`);
    console.log(`Exclude: ${exclude_dirs}`);
    console.log(`token: ${style}`);

    console.log("========= CONTEXT ==========")
    console.log(github.context)

    console.log("========= issue ==========")
    console.log(github.context.issue)
} catch (error) {
    core.setFailed(error.message);
}