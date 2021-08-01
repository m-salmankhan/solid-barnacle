"use strict";
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
exports.__esModule = true;
var glob_1 = require("@actions/glob");
var exec_1 = require("@actions/exec");
var path = require('path');
var handlers_1 = require("./handlers");
var constants_1 = require("../constants");
var inputs = require("../inputs");
var git_commands_1 = require("../git-commands");
var HandleFormat = (function () {
    function HandleFormat() {
    }
    HandleFormat.findFiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var include, exclude;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        include = inputs.fileExtensions
                            .map(function (ext) { return "**/*." + ext; })
                            .join('\n');
                        exclude = inputs.exclude_dirs
                            .map(function (dir) { return "!" + dir; })
                            .join('\n');
                        return [4, glob_1.create(include + "\n" + exclude)
                                .then(function (g) { return g.globGenerator(); })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    HandleFormat.commitAndPush = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Committing and pushing changes...");
                        return [4, git_commands_1.haveFilesChanged()];
                    case 1:
                        if (!_a.sent()) return [3, 4];
                        return [4, git_commands_1.commit("Auto-formatted Code")];
                    case 2:
                        _a.sent();
                        return [4, git_commands_1.push()];
                    case 3:
                        _a.sent();
                        return [3, 5];
                    case 4:
                        console.log("Nothing has changed. Nothing to commit!");
                        _a.label = 5;
                    case 5: return [2];
                }
            });
        });
    };
    HandleFormat.prototype.handle = function (command) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, _c, file, ext, exitCode, e_1_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.log("Starting format command.");
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 15, 16, 21]);
                        return [4, HandleFormat.findFiles()];
                    case 2:
                        _b = __asyncValues.apply(void 0, [_d.sent()]);
                        _d.label = 3;
                    case 3: return [4, _b.next()];
                    case 4:
                        if (!(_c = _d.sent(), !_c.done)) return [3, 14];
                        file = _c.value;
                        console.log("   Formatting file " + file);
                        ext = path.extname(file).substring(1);
                        exitCode = void 0;
                        if (!constants_1.clangExtensions.includes(ext)) return [3, 6];
                        return [4, exec_1.exec("clang-format -i -style=" + inputs.cStyle + " " + file)];
                    case 5:
                        exitCode = _d.sent();
                        return [3, 12];
                    case 6:
                        if (!constants_1.pythonExtensions.includes(ext)) return [3, 11];
                        if (!(inputs.pythonStyle.toLowerCase() == "black")) return [3, 8];
                        return [4, exec_1.exec("black " + file)];
                    case 7:
                        exitCode = _d.sent();
                        return [3, 10];
                    case 8: return [4, exec_1.exec("yapf -i -style=" + inputs.pythonStyle + " " + file)];
                    case 9:
                        exitCode = _d.sent();
                        _d.label = 10;
                    case 10: return [3, 12];
                    case 11: throw new Error("*." + ext + " files are not yet supported");
                    case 12:
                        if (exitCode)
                            throw new Error("Error formatting " + file);
                        _d.label = 13;
                    case 13: return [3, 3];
                    case 14: return [3, 21];
                    case 15:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3, 21];
                    case 16:
                        _d.trys.push([16, , 19, 20]);
                        if (!(_c && !_c.done && (_a = _b["return"]))) return [3, 18];
                        return [4, _a.call(_b)];
                    case 17:
                        _d.sent();
                        _d.label = 18;
                    case 18: return [3, 20];
                    case 19:
                        if (e_1) throw e_1.error;
                        return [7];
                    case 20: return [7];
                    case 21: return [4, HandleFormat.commitAndPush()];
                    case 22:
                        _d.sent();
                        return [2];
                }
            });
        });
    };
    return HandleFormat;
}());
handlers_1.handlers.registerHandler("format", new HandleFormat());
//# sourceMappingURL=format.js.map