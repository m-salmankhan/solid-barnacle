const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const glob = require('@actions/glob');

const fileExtensions:[string] = core.getInput('file-extensions').split(" ");
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

async function checkoutBranch(branch: String) {
    await exec.exec(`git fetch`);
    // TODO: work out how to add error handling for this
    //  could fail if uncommitted changes made on current branch
    await exec.exec(`git checkout ${branch}`);
}

interface Handler {
    run(command: String): void;
}

const handlers: Map<String,Handler> = new Map<String, Handler>();
function registerHandler(command: String, handler: Handler) {
    handlers.set(command, handler);
}

// returns handler for that command if found, undefined otherwise
function selectHandler(command: String): Handler {
    return handlers.get(
        command.substring(1).split(' ')[0]
    );
}

// Returns first line of comment if it starts with a slash, null otherwise
function getCommand(): String {
    const comment:string = github.context.payload.comment.body;
    if(comment[0] === '/')
        return comment.split('\n')[0];
    return null;
}

/*
* Deals with /format command
* */
registerHandler("format", new class implements Handler {
    async run(command: string) {
        console.log("Starting format command.");
        let str:String = fileExtensions.join('\n');
        console.log("Searching for files:\n" + str)
        const globber = await glob.create(str);
        const files = await globber.glob();
        console.log("====FOUND FILES====")
        console.log(files);
    }
});

async function run() {
    const command: String = getCommand();

    // if just a normal comment -- no command
    if(command == null)
        return;

    const handler: Handler = selectHandler(command);

    if(handler == undefined) {
        console.log(`Command not recognised: \n ${command}`);
        return;
    }

    await checkoutBranch(await getBranch());
    handler.run(command);
}

run();