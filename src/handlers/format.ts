const glob = require('@actions/glob');
const exec = require('@actions/exec');
const path = require('path');

import {Handler, handlers} from "./Handler";
import {clangExtensions} from "../constants";
import * as inputs from "../inputs";
import {haveFilesChanged, commit, push} from "../git-commands";

/*
* Deals with /format command
* */
class HandleFormat implements Handler {
    async handle(command: string) {
        console.log("Starting format command.");
        let include:string =
            inputs.fileExtensions
                .map((ext: string) => `**/*.${ext}`)
                .join('\n');

        let exclude:string = inputs.exclude_dirs
            .map((dir: string) => `!${dir}`)
            .join('\n');

        const globber = await glob.create(`${include}\n${exclude}`)

        for await (const file of globber.globGenerator()) {
            console.log(`   Formatting file ${file}`);
            const ext = path.extname(file).substring(1);
            // if it's one of the languages formatted by clang
            if(clangExtensions.includes(ext))
                await exec.exec(`clang-format -i -style=${inputs.cStyle} ${file}`);
            else if(ext) {
                throw new Error("Python not yet supported");
            } else {
                throw new Error(`*.${ext} files are not yet supported`);
            }
        }

        console.log("Committing and pushing changes...")

        if(await haveFilesChanged()) {
            await commit("Auto-formatted Code");
            await push();
        } else {
            console.log("Nothing has changed. Nothing to commit!");
        }
    }
}

handlers.registerHandler("format", new HandleFormat());
