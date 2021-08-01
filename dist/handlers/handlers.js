"use strict";
exports.__esModule = true;
exports.handlers = void 0;
var Handlers = (function () {
    function Handlers() {
        this.list = new Map();
    }
    Handlers.prototype.registerHandler = function (command, handler) {
        this.list.set(command, handler);
    };
    Handlers.prototype.selectHandler = function (command) {
        console.log("KEY:=========");
        console.log(command.substring(1).split(' ')[0]);
        console.log(this.list);
        return this.list.get(command.substring(1).split(' ')[0]);
    };
    return Handlers;
}());
exports.handlers = new Handlers();
//# sourceMappingURL=handlers.js.map