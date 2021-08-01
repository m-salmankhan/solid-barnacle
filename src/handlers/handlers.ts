export interface Handler {
    handle(command: string): void;
}

class Handlers {
    private readonly list: Map<string, Handler> = new Map<string, Handler>();

    public registerHandler(command: string, handler: Handler) {
        this.list.set(command, handler);
    }

    // returns handler for that command if found, undefined otherwise
    public selectHandler(command: string): Handler {
        console.log("KEY:=========")
        console.log(command.substring(1).split(' ')[0]);
        console.log(this.list);
        return this.list.get(
            command.substring(1).split(' ')[0]
        );
    }
}

export const handlers = new Handlers();

// Import all the handlers
import "./format";