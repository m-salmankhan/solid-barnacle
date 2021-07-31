const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const fileExtensions = core.getInput('file-extensions');
        const style = core.getInput('style');
        const exclude_dirs = core.getInput('exclude-dirs');
        const token = core.getInput('token');

        const octokit = github.getOctokit(token)

        console.log(`File Extensions: ${fileExtensions}`);
        console.log(`Style: ${style}`);
        console.log(`Exclude: ${exclude_dirs}`);
        console.log(`token: ${style}`);

        console.log("========= CONTEXT ==========")
        console.log(github.context)

        console.log("========= issue ==========")
        console.log(github.context.issue)

        const ref = await octokit.rest.pulls.get({
            owner: github.context.issue.owner,
            repo: github.context.issue.repo,
            pull_number: github.context.issue.number,
        }).then(
            (resp: { data: { head: { ref: String }; }; }) => {
                return Promise.resolve(resp.data.head.ref);
            }
        )

        console.log(ref)
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();