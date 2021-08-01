import * as core from "@actions/core";

import {Handler, handlers} from "./handlers/handlers";
import {checkoutBranch} from "./git-commands";
import {getCommand, getBranch} from "./helpers";

async function run():Promise<void> {
    const command: string = getCommand();

    // if just a normal comment -- no command
    if(command == null)
        return;

    const handler: Handler = handlers.selectHandler(command);

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