"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var express_1 = __importDefault(require("express"));
var warrant_js_1 = require("@warrantdev/warrant-js");
var cors_1 = __importDefault(require("cors"));
var app = express_1.default();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(cors_1.default());
//
// JSON Data
// NOTE: This pattern is just for demo purposes and
// should not be replicated in a production application.
//
var users = [
    {
        id: 1,
        email: "admin@storebuddy.com",
        firstName: "StoreBuddy",
        lastName: "Admin",
    },
    {
        id: 3,
        email: "michael.scott@dundermifflin.com",
        firstName: "Michael",
        lastName: "Scott",
    },
    {
        id: 5,
        email: "tony@starkindustries.com",
        firstName: "Anthony",
        lastName: "Stark",
    },
    {
        id: 7,
        email: "johndoe@gmail.com",
        firstName: "John",
        lastName: "Doe",
    },
];
var stores = [
    {
        id: 1,
        userId: 3,
        name: "Michael Scott Paper Company",
        items: [
            {
                id: 1,
                storeId: 1,
                name: "Standard 8.5x11 White Paper (500 sheets)",
                description: "One ream of our standard quality 8.5in x 11in white paper",
                price: 4.99,
            },
            {
                id: 3,
                storeId: 1,
                name: "High Quality 8.5x11 White Paper (500 sheets)",
                description: "One ream of our highest quality 8.5in x 11in glossy white paper",
                price: 6.99,
            },
            {
                id: 5,
                storeId: 1,
                name: "Standard 8.5x11 White Paper (10 x 500 sheets)",
                description: "10 reams of our standard quality 8.5in x 11in white paper",
                price: 45.99,
            },
        ],
    },
    {
        id: 3,
        userId: 5,
        name: "Iron Man Memorabilia Store",
        items: [
            {
                id: 7,
                storeId: 3,
                name: "Arc Reactor Prototype",
                description: "An exact replica of the Arc Reactor prototype Tony built to keep shrapnel from reaching his heart",
                price: 124.99,
            },
            {
                id: 9,
                storeId: 3,
                name: "Iron Man (Mk I)",
                description: "An exact replica of the Mk I Iron Man suit Tony built to escape his kidnappers",
                price: 799.99,
            },
            {
                id: 11,
                storeId: 3,
                name: "Flight Stabilizer",
                description: "A handheld flight stabilizer capable of releasing a concussive blast",
                price: 1249.99,
            },
        ],
    },
];
//
// Global Variables
// NOTE: This pattern is just for demo purposes and
// should not be replicated in a production application.
//
var warrantApiKey = "prod_f5dsKVeYnVSLHGje44zAygqgqXiLJBICbFzCiAGOg1E=";
var loggedInUserEmail = null;
//
// Authorization Middleware
//
function authorization(permissionNames) {
    var _this = this;
    return function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var warrant, _i, permissionNames_1, permissionName, userHasAccess;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    warrant = new warrant_js_1.Client(warrantApiKey);
                    _i = 0, permissionNames_1 = permissionNames;
                    _a.label = 1;
                case 1:
                    if (!(_i < permissionNames_1.length)) return [3 /*break*/, 4];
                    permissionName = permissionNames_1[_i];
                    return [4 /*yield*/, warrant.isAuthorized(loggedInUserEmail, permissionName)];
                case 2:
                    userHasAccess = _a.sent();
                    if (userHasAccess) {
                        next();
                        return [2 /*return*/];
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    res.sendStatus(401);
                    return [2 /*return*/];
            }
        });
    }); };
}
//
// Authentication Routes
//
app.post("/api/login", function (req, res) {
    var email = req.body.email;
    var _a = getUser(email), user = _a[0], _ = _a[1];
    if (!user) {
        res.sendStatus(401);
        return;
    }
    loggedInUserEmail = user.email;
    res.sendStatus(200);
    return;
});
//
// Store Routes
//
app.get("/api/stores", authorization(["view_stores"]), function (req, res) {
    res.json(stores);
    return;
});
app.get("/api/stores/:storeId", authorization(["view_stores"]), function (req, res) {
    var storeId = parseInt(req.params.storeId);
    var _a = getStore(storeId), store = _a[0], _ = _a[1];
    if (!store) {
        res.sendStatus(404);
        return;
    }
    res.json(store);
    return;
});
app.post("/api/stores/:storeId", authorization(["edit_stores", "edit_stores_any"]), function (req, res) {
    var storeId = parseInt(req.params.storeId);
    var _a = getStore(storeId), store = _a[0], index = _a[1];
    var _b = getUser(loggedInUserEmail), loggedInUser = _b[0], _ = _b[1];
    if (!store || store.userId !== loggedInUser.id) {
        res.sendStatus(404);
        return;
    }
    var updatedStore = __assign({}, store);
    updatedStore.name = req.body.name;
    stores[index] = updatedStore;
    res.json(updatedStore);
    return;
});
//
// Store Authorization Routes
//
app.get("/api/stores/:storeId/edit", authorization(["edit_stores"]), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var storeId, store, loggedInUser, warrant, canEditAny;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                storeId = parseInt(req.params.storeId);
                store = getStore(storeId)[0];
                loggedInUser = getUser(loggedInUserEmail)[0];
                if (!store) {
                    res.sendStatus(404);
                    return [2 /*return*/];
                }
                warrant = new warrant_js_1.Client(warrantApiKey);
                return [4 /*yield*/, warrant.isAuthorized(loggedInUserEmail, "edit_stores_any")];
            case 1:
                canEditAny = _a.sent();
                if (store.userId === loggedInUser.id || canEditAny) {
                    res.sendStatus(200);
                    return [2 /*return*/];
                }
                res.sendStatus(401);
                return [2 /*return*/];
        }
    });
}); });
//
// Item Routes
//
app.get("/api/stores/:storeId/items", authorization(["view_items"]), function (req, res) {
    var storeId = parseInt(req.params.storeId);
    var _a = getStore(storeId), store = _a[0], _ = _a[1];
    if (!store) {
        res.sendStatus(404);
        return;
    }
    res.json(store.items);
    return;
});
app.get("/api/stores/:storeId/items/:itemId", authorization(["view_items"]), function (req, res) {
    var storeId = parseInt(req.params.storeId);
    var itemId = parseInt(req.params.itemId);
    var _a = getStore(storeId), store = _a[0], _ = _a[1];
    if (!store) {
        res.sendStatus(404);
        return;
    }
    var item = getItem(store, itemId);
    if (!item) {
        res.sendStatus(404);
        return;
    }
    res.json(item);
    return;
});
app.post("/api/stores/:storeId/items/:itemId", authorization(["edit_items", "edit_items_any"]), function (req, res) {
    var storeId = parseInt(req.params.storeId);
    var itemId = parseInt(req.params.itemId);
    var _a = getStore(storeId), store = _a[0], storeIndex = _a[1];
    var loggedInUser = getUser(loggedInUserEmail)[0];
    if (!store || store.userId !== loggedInUser.id) {
        res.sendStatus(404);
        return;
    }
    var _b = getItem(store, itemId), item = _b[0], itemIndex = _b[1];
    if (!item) {
        res.sendStatus(404);
        return;
    }
    var updatedItem = __assign({}, item);
    updatedItem.name = req.body.name;
    updatedItem.description = req.body.description;
    updatedItem.price = req.body.price;
    stores[storeIndex].items[itemIndex] = updatedItem;
    res.json(updatedItem);
    return;
});
//
// Store Authorization Routes
//
// app.get("/api/stores/:storeId/items/:itemId/edit", authorization(["edit_items", "edit_items_any"]), (req: Request, res: Response): void => {
//     const storeId = parseInt(req.params.storeId);
//     const itemId = parseInt(req.params.itemId);
//     const [store, _] = getStore(storeId);
//     if (!store) {
//         res.sendStatus(404);
//         return;
//     }
//     const warrant = new WarrantClient(warrantApiKey);
//     if (store.userId === loggedInUserId || warrant.isAuthorized(loggedInUserId.toString(), "edit_items")) {
//         res.sendStatus(200);
//         return;
//     }
//     res.sendStatus(401);
//     return;
// });
//
// Authorization Routes
//
app.get("/api/authorize/:permissionNames", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var permissionNames, warrant, _i, permissionNames_2, permissionName, isAuthorized;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                permissionNames = decodeURIComponent(req.params.permissionNames).split(",");
                warrant = new warrant_js_1.Client(warrantApiKey);
                _i = 0, permissionNames_2 = permissionNames;
                _a.label = 1;
            case 1:
                if (!(_i < permissionNames_2.length)) return [3 /*break*/, 4];
                permissionName = permissionNames_2[_i];
                return [4 /*yield*/, warrant.isAuthorized(loggedInUserEmail, permissionName)];
            case 2:
                isAuthorized = _a.sent();
                if (isAuthorized) {
                    res.sendStatus(200);
                    return [2 /*return*/];
                }
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                res.sendStatus(401);
                return [2 /*return*/];
        }
    });
}); });
app.listen(8000, function () {
    console.log("Server listening on port 8000. API available at http://localhost:8000");
});
function getUser(email) {
    var targetUser;
    var index;
    for (index = 0; index < users.length; index++) {
        var user = users[index];
        if (user.email === email) {
            targetUser = user;
            break;
        }
    }
    return [targetUser, index];
}
function getStore(id) {
    var targetStore;
    var index;
    for (index = 0; index < stores.length; index++) {
        var store = stores[index];
        if (store.id === id) {
            targetStore = store;
            break;
        }
    }
    return [targetStore, index];
}
function getItem(store, itemId) {
    var targetItem;
    var index;
    for (index = 0; index < store.items.length; index++) {
        var item = store.items[index];
        if (item.id === itemId) {
            targetItem = item;
            break;
        }
    }
    return [targetItem, index];
}
//# sourceMappingURL=index.js.map