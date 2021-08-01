import * as core from "@actions/core";
import * as github from "@actions/github";

import {Handlers, handlers} from "./handlers/handlers";
import {token} from "./inputs";
import {checkoutBranch} from "./git-commands";

const octokit = github.getOctokit(token);

// Gets the branch that the PR is merging from
async function getBranch() {
    try {
        // Use context info to get the head reference for source branch of PR
        return  octokit.rest.pulls.get({
            owner: github.context.issue.owner,
            repo: github.context.issue.repo,
            pull_number: github.context.issue.number,
        }).then(
            (resp: { data: { head: { ref: string }; }; }): Promise<string> => {
                return Promise.resolve(resp.data.head.ref);
            }
        )
    } catch (error) {
        core.setFailed(error.message);
    }
}

// Returns first line of comment if it starts with a slash, null otherwise
function getCommand(): string {
    const comment:string = github.context.payload.comment.body;
    if(comment[0] === '/')
        return comment.split('\n')[0];
    return null;
}

async function run():Promise<void> {
    const command: string = getCommand();

    // if just a normal comment -- no command
    if(command == null)
        return;

    const handler: Handlers = handlers.selectHandler(command);

    if(handler == undefined) {
        console.log(`Command not recognised:\n${command}`);
        return;
    }

    try {
        await checkoutBranch(await getBranch());
        await handler.handle(command);
    } catch (e) {
        core.setFailed(`An unexpected error occurred:\n ${e.message}`);
    }
}

run();