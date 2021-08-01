const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const glob = require('@actions/glob');
const path = require('path');

const fileExtensions:Array<string> = core.getInput('file-extensions').split(" ");
const cStyle:string = core.getInput('c-style');
const pythonStyle:string = core.getInput('python-style');
const exclude_dirs: Array<string> = core.getInput('exclude-dirs').split(" ");
const token:string = core.getInput('token');

const clangExtensions: Array<string> = ["c", "h", "cpp", "java", "json", "js"];

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
            (resp: { data: { head: { ref: String }; }; }): Promise<String> => {
                return Promise.resolve(resp.data.head.ref);
            }
        )
    } catch (error) {
        core.setFailed(error.message);
    }
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
    console.log("KEY:=========")
    console.log(command.substring(1).split(' ')[0]);
    console.log(handlers);
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
        let include:String = fileExtensions.map(ext => `**/*.${ext}`).join('\n');
        let exclude:String = exclude_dirs.map(dir => `!${dir}`).join('\n');
        const globber = await glob.create(`${include}\n${exclude}`)
        for await (const file of globber.globGenerator()) {
            console.log(`   Formatting file ${file}`);
            const ext = path.extname(file).substring(1);
            // if it's one of the languages formatted by clang
            if(clangExtensions.includes(ext))
                await exec.exec(`clang-format -i -style=${cStyle} ${file}`);
            else if(ext) {
                throw new Error("Python not yet supported");
            } else {
                throw new Error(`*.${ext} files are not yet supported`);
            }
        }

        console.log("Committing and pushing changes...")

        if(await haveFilesChanged()) {
            await commit("Auto-formatted Code");
        } else {
            console.log("Nothing has changed. Nothing to commit!");
        }
    }
});

// Checkout branch with provided string
async function checkoutBranch(branch: String): Promise<void> {
    await exec.exec(`git fetch`)
        .then((exitCode: number): Promise<number> => {
            if(exitCode)
                throw new Error("Failed to fetch from remote.");

            // Checkout branch
            // TODO: Is this a security vulnerability? Escaping handled by library
            return exec.exec(`git checkout`, [branch]);
        }).then((exitCode: number):Promise<void> => {
            if(exitCode)
                throw new Error("Failed to fetch from remote.");

            return Promise.resolve();
        });
}

// Check output of git diff to see if files have changed
// TODO: there has to be a better way of doing this.
async function haveFilesChanged() : Promise<Boolean> {
    let stdout:String = "",
        stderr:String = "";

    return exec.exec("git diff", [], {
        listeners: {
            stdout: (data: Buffer) => {
                stdout += data.toString();
            },
            stderr: (data: Buffer) => {
                stderr += data.toString();
            }
        },
    }).then((exitCode: number): Promise<boolean> => {
        if(exitCode)
            throw new Error("Failed to diff changes");

        return Promise.resolve(stdout.length > 0);
    });
}

async function commit(commitMessage: String): Promise<number> {
    // Set git email
    return await exec.exec(
        "git config --local user.email \"41898282+github-actions[bot]@users.noreply.github.com\""
    ).then( (exitCode: number): Promise<number> => {
        if(exitCode)
            throw new Error("Error setting git config email\n");
        // Set git name
        return exec.exec("git config --local user.name \"github-actions[bot]\"");
    }).then( (exitCode:number): Promise<number> => {
        if(exitCode)
            throw new Error("Error setting git config name\n");

        // Add and commit modified files
        return exec.exec("git commit -am", [commitMessage]);
    }).then((exitCode: number): Promise<number> => {
        if(exitCode)
            throw new Error("Error committing\n");

        // Push commit
        return exec.exec("git push");
    }).then((exitCode: number): Promise<number> => {
        if(exitCode)
            throw new Error("Error pushing code\n");

        return Promise.resolve(0);
    }).catch( (e:Error) => {
        // Catch whatever error and re-throw to show which step it failed on
        throw new Error("Failed to commit changes:\n" + e.message);
    })
}

async function push(): Promise<void> {
    const exitCode:number = await exec.exec("git push");
    if(exitCode)
        throw new Error("Error pushing code\n");
}

async function run():Promise<void> {
    const command: String = getCommand();

    // if just a normal comment -- no command
    if(command == null)
        return;

    const handler: Handler = selectHandler(command);

    if(handler == undefined) {
        console.log(`Command not recognised:\n${command}`);
        return;
    }

    try {
        await checkoutBranch(await getBranch());
        await handler.run(command);
        await push();
    } catch (e) {
        core.setFailed(`An unexpected error occurred:\n ${e.message}`);
    }
}

run();