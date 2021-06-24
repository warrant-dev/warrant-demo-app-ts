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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
var axios_1 = __importDefault(require("axios"));
var Client = /** @class */ (function () {
    function Client(apiKey) {
        this.apiKey = apiKey;
        this.httpClient = axios_1.default.create({
            baseURL: Client.apiUrlBase + "/" + Client.apiVersion,
            headers: {
                Authorization: "ApiKey " + this.apiKey,
            },
        });
    }
    /**
     * Creates a user entity in Warrant with the given uuid and assigns the created user the role with the given roleId.
     * Call this method whenever a new user is created within your system. After using this method to create a user entity
     * in Warrant, you can use Warrant to authorize subsequent actions the given user takes.
     *
     * @param uuid The unique identifier used to identify the given user in your system (i.e. a database generated id).
     * @param roleId The id of the role (in Warrant) that you would like to assign to the given user.
     */
    Client.prototype.createUser = function (uuid, roleId) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClient.post("/users", {
                                uuid: uuid,
                                role: {
                                    id: roleId,
                                },
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Checks against your role permission and user permission assignments in Warrant to determine if the user with the given
     * uuid has the permission with the given permissionId. Returns true if the user does have the permission and false otherwise.
     *
     * @param uuid The unique identifier used to identify the given user in your system (i.e. a database generated id).
     * @param permissionName The name of the permission (in Warrant) that you would like to check access against for the given user.
     */
    Client.prototype.isAuthorized = function (uuid, permissionName) {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClient.get("/users/" + uuid + "/authorize/" + permissionName)];
                    case 1:
                        response = _a.sent();
                        if (response.status === 200) {
                            return [2 /*return*/, true];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        // TODO: Implement nicer errors
                        if (e_2.response.status !== 401) {
                            console.log("Error authorizing access through Warrant", e_2);
                        }
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Client.apiUrlBase = "https://api.warrant.dev";
    Client.apiVersion = "v1";
    return Client;
}());
exports.Client = Client;
//# sourceMappingURL=index.js.map