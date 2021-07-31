const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');

const fileExtensions:string = core.getInput('file-extensions');
const style:string = core.getInput('style');
const exclude_dirs:string = core.getInput('exclude-dirs');
const token:string = core.getInput('token');

const octokit = github.getOctokit(token)

async function getBranch() {
    try {
        console.log("========= CONTEXT ==========")
        console.log(github.context)

        return  octokit.rest.pulls.get({
            owner: github.context.issue.owner,
            repo: github.context.issue.repo,
            pull_number: github.context.issue.number,
        }).then(
            (resp: { data: { head: { ref: String }; }; }) => {
                return Promise.resolve(resp.data.head.ref);
            }
        )
    } catch (error) {
        core.setFailed(error.message);
    }
}

async function run() {
    const branch:string = await getBranch();
    await exec.exec(`git show-refs ${branch}`);
    await exec.exec(`git checkout ${branch}`);
}

run();