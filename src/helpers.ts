
// Gets the branch that the PR is merging from
import {getOctokit, context} from "@actions/github";
import * as core from "@actions/core";
import {token} from "./inputs";

export const octokit = getOctokit(token);

export async function getBranch() {
    try {
        // Use context info to get the head reference for source branch of PR
        return  octokit.rest.pulls.get({
            owner: context.issue.owner,
            repo: context.issue.repo,
            pull_number: context.issue.number,
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
export function getCommand(): string {
    const comment:string = context.payload.comment.body;
    if(comment[0] === '/')
        return comment.split(/[\n\r]/)[0];
    return null;
}