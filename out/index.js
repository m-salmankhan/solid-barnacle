var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var core = require('@actions/core');
var github = require('@actions/github');
var exec = require('@actions/exec');
var glob = require('@actions/glob');
var fileExtensions = core.getInput('file-extensions').split(" ");
var style = core.getInput('style');
var exclude_dirs = core.getInput('exclude-dirs').split(" ");
var token = core.getInput('token');
var octokit = github.getOctokit(token);
function getBranch() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                console.log("========= CONTEXT ==========");
                console.log(github.context);
                return [2, octokit.rest.pulls.get({
                        owner: github.context.issue.owner,
                        repo: github.context.issue.repo,
                        pull_number: github.context.issue.number,
                    }).then(function (resp) {
                        return Promise.resolve(resp.data.head.ref);
                    })];
            }
            catch (error) {
                core.setFailed(error.message);
            }
            return [2];
        });
    });
}
function checkoutBranch(branch) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, exec.exec("git fetch")];
                case 1:
                    _a.sent();
                    return [4, exec.exec("git checkout " + branch)];
                case 2:
                    _a.sent();
                    return [2];
            }
        });
    });
}
var handlers = new Map();
function registerHandler(command, handler) {
    handlers.set(command, handler);
}
function selectHandler(command) {
    return handlers.get(command.substring(1).split(' ')[0]);
}
function getCommand() {
    var comment = github.context.payload.comment.body;
    if (comment[0] === '/')
        return comment.split('\n')[0];
    return null;
}
registerHandler("format", new (function () {
    function class_1() {
    }
    class_1.prototype.run = function (command) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function () {
            var include, exclude, globber, _b, _c, file, e_1_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.log("Starting format command.");
                        include = fileExtensions.map(function (ext) { return "**/*." + ext; }).join('\n');
                        exclude = exclude_dirs.map(function (dir) { return "!" + dir; }).join('\n');
                        return [4, glob.create(include + "\n" + exclude)];
                    case 1:
                        globber = _d.sent();
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 7, 8, 13]);
                        _b = __asyncValues(globber.globGenerator());
                        _d.label = 3;
                    case 3: return [4, _b.next()];
                    case 4:
                        if (!(_c = _d.sent(), !_c.done)) return [3, 6];
                        file = _c.value;
                        console.log("found:\n");
                        console.log(file);
                        _d.label = 5;
                    case 5: return [3, 3];
                    case 6: return [3, 13];
                    case 7:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3, 13];
                    case 8:
                        _d.trys.push([8, , 11, 12]);
                        if (!(_c && !_c.done && (_a = _b["return"]))) return [3, 10];
                        return [4, _a.call(_b)];
                    case 9:
                        _d.sent();
                        _d.label = 10;
                    case 10: return [3, 12];
                    case 11:
                        if (e_1) throw e_1.error;
                        return [7];
                    case 12: return [7];
                    case 13: return [2];
                }
            });
        });
    };
    return class_1;
}()));
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var command, handler, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    command = getCommand();
                    if (command == null)
                        return [2];
                    handler = selectHandler(command);
                    if (handler == undefined) {
                        console.log("Command not recognised: \n " + command);
                        return [2];
                    }
                    _a = checkoutBranch;
                    return [4, getBranch()];
                case 1: return [4, _a.apply(void 0, [_b.sent()])];
                case 2:
                    _b.sent();
                    handler.run(command);
                    return [2];
            }
        });
    });
}
run();
//# sourceMappingURL=index.js.map