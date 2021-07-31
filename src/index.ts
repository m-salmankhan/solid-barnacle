const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');

const fileExtensions:string = core.getInput('file-extensions');
const style:string = core.getInput('style');
const exclude_dirs:string = core.getInput('exclude-dirs');
const token:string = core.getInput('token');

const octokit = github.getOctokit(token);

async function getBranch() {
    try {
        console.log("========= CONTEXT ==========")
        console.log(github.context)

        // Use context info to get the head reference for source branch of PR
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

async function checkoutBranch(branch:String) {
    await exec.exec(`git fetch`);
    await exec.exec(`git checkout ${branch}`);
}

async function run() {
    await checkoutBranch(await getBranch());
}

run();