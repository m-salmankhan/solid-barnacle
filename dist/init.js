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
exports.__esModule = true;
exports.init = exports.hasBin = void 0;
var exec_1 = require("@actions/exec");
var constants_1 = require("./constants");
var core = require("@actions/core");
function hasBin(name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, exec_1.exec("which", [name])
                    .then(function (exitCode) {
                    if (exitCode)
                        return Promise.resolve(false);
                    return Promise.resolve(true);
                })];
        });
    });
}
exports.hasBin = hasBin;
function ensureDependenciesResolved() {
    var _this = this;
    return Promise.all(constants_1.requiredBinaries
        .map(function (binary) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, hasBin(binary)];
            case 1: return [2, _a.sent()];
        }
    }); }); })).then(function (results) {
        var failed = [];
        results.forEach(function (res, index) {
            if (res === false)
                failed.push(constants_1.requiredBinaries[index]);
        });
        if (failed !== [])
            core.setFailed("The following commands were unavailable:\n\t" + failed.join("\n\t"));
    });
}
function installPipPackages() {
    var _this = this;
    return exec_1.exec("python -m pip install --upgrade pip")
        .then(function (exitCode) {
        if (exitCode)
            throw new Error("Couldn't update pip");
        return exec_1.exec("pip install yapf");
    }).then(function (exitCode) { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = exitCode;
                    if (_a) return [3, 2];
                    return [4, hasBin("yapf")];
                case 1:
                    _a = !(_b.sent());
                    _b.label = 2;
                case 2:
                    if (_a)
                        throw new Error("Couldn't install yapf");
                    return [2, exec_1.exec("pip install black")];
            }
        });
    }); }).then(function (exitCode) { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = exitCode;
                    if (_a) return [3, 2];
                    return [4, hasBin("black")];
                case 1:
                    _a = !(_b.sent());
                    _b.label = 2;
                case 2:
                    if (_a)
                        throw new Error("Couldn't install black");
                    return [2];
            }
        });
    }); })["catch"](function (e) {
        core.setFailed("Unexpected error: " + e.message);
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, ensureDependenciesResolved()];
                case 1:
                    _a.sent();
                    return [4, installPipPackages()];
                case 2:
                    _a.sent();
                    return [2];
            }
        });
    });
}
exports.init = init;
//# sourceMappingURL=init.js.map