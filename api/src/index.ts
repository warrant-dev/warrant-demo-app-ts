import express, {Request, Response, NextFunction} from "express";
import {Client as WarrantClient} from "@warrantdev/warrant-js";
import cors from "cors";

import Store from "./types/Store";
import User from "./types/User";
import Item from "./types/Item";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

//
// JSON Data
// NOTE: This pattern is just for demo purposes and
// should not be replicated in a production application.
//
let users: User[] = [
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

let stores: Store[] = [
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
const warrantApiKey = "prod_f5dsKVeYnVSLHGje44zAygqgqXiLJBICbFzCiAGOg1E=";
let loggedInUserEmail: string | null = null;

//
// Authorization Middleware
//
function authorization(permissionNames: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const warrant = new WarrantClient(warrantApiKey);

        for (const permissionName of permissionNames) {
            const userHasAccess = await warrant.isAuthorized(loggedInUserEmail, permissionName);
            if (userHasAccess) {
                next();
                return;
            }
        }

        res.sendStatus(401);
    }
}

//
// Authentication Routes
//
app.post("/api/login", async (req: Request, res: Response): Promise<void> => {
    const email = req.body.email;
    const [user, _] = getUser(email);

    if (!user) {
        res.sendStatus(401);
        return;
    }

    loggedInUserEmail = user.email;

    // Create session for user in Warrant
    const warrant = new WarrantClient(warrantApiKey);
    const warrantSessionToken = await warrant.createSession(loggedInUserEmail);

    res.json({
        warrantSessionToken,
    });
});

//
// Store Routes
//
app.get("/api/stores", authorization(["view_stores"]), (req: Request, res: Response): void => {
    res.json(stores);
});

app.get("/api/stores/:storeId", authorization(["view_stores"]), (req: Request, res: Response): void => {
    const storeId = parseInt(req.params.storeId);
    const [store, _] = getStore(storeId);

    if (!store) {
        res.sendStatus(404);
        return;
    }

    res.json(store);
    return;
});

app.post("/api/stores/:storeId", authorization(["edit_stores", "edit_stores_any"]), (req: Request, res: Response): void => {
    const storeId = parseInt(req.params.storeId);
    const [store, index] = getStore(storeId);
    const [loggedInUser, _] = getUser(loggedInUserEmail);

    if (!store || store.userId !== loggedInUser.id) {
        res.sendStatus(404);
        return;
    }

    let updatedStore = {...store};
    updatedStore.name = req.body.name;
    stores[index] = updatedStore;

    res.json(updatedStore);
    return;
});

//
// Store Authorization Routes
//
app.get("/api/stores/:storeId/edit", authorization(["edit_stores"]), async (req: Request, res: Response): Promise<void> => {
    const storeId = parseInt(req.params.storeId);
    const [store] = getStore(storeId);
    const [loggedInUser] = getUser(loggedInUserEmail);

    if (!store) {
        res.sendStatus(404);
        return;
    }

    const warrant = new WarrantClient(warrantApiKey);
    const canEditAny = await warrant.isAuthorized(loggedInUserEmail, "edit_stores_any");
    if (store.userId === loggedInUser.id || canEditAny) {
        res.sendStatus(200);
        return;
    }

    res.sendStatus(401);
    return;
});

//
// Item Routes
//
app.get("/api/stores/:storeId/items", authorization(["view_items"]), (req: Request, res: Response): void => {
    const storeId = parseInt(req.params.storeId);
    const [store, _] = getStore(storeId);

    if (!store) {
        res.sendStatus(404);
        return;
    }

    res.json(store.items);
    return;
});

app.get("/api/stores/:storeId/items/:itemId", authorization(["view_items"]), (req: Request, res: Response): void => {
    const storeId = parseInt(req.params.storeId);
    const itemId = parseInt(req.params.itemId);

    const [store, _] = getStore(storeId);
    if (!store) {
        res.sendStatus(404);
        return;
    }

    const item = getItem(store, itemId);
    if (!item) {
        res.sendStatus(404);
        return;
    }

    res.json(item);
    return;
});

app.post("/api/stores/:storeId/items/:itemId", authorization(["edit_items", "edit_items_any"]), (req: Request, res: Response): void => {
    const storeId = parseInt(req.params.storeId);
    const itemId = parseInt(req.params.itemId);
    const [store, storeIndex] = getStore(storeId);
    const [loggedInUser] = getUser(loggedInUserEmail);

    if (!store || store.userId !== loggedInUser.id) {
        res.sendStatus(404);
        return;
    }

    const [item, itemIndex] = getItem(store, itemId);
    if (!item) {
        res.sendStatus(404);
        return;
    }

    let updatedItem = {...item};
    updatedItem.name = req.body.name;
    updatedItem.description = req.body.description;
    updatedItem.price = req.body.price;
    stores[storeIndex].items[itemIndex] = updatedItem;

    res.json(updatedItem);
    return;
});

//
// Authorization Routes
//
app.get("/api/authorize/:permissionNames", async (req: Request, res: Response): Promise<void> => {
    const permissionNames = decodeURIComponent(req.params.permissionNames).split(",");
    const warrant = new WarrantClient(warrantApiKey);

    for (const permissionName of permissionNames) {
        const isAuthorized = await warrant.isAuthorized(loggedInUserEmail, permissionName);
        if (isAuthorized) {
            res.sendStatus(200);
            return;
        }
    }

    res.sendStatus(401);
    return;
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}. API available at http://localhost:${port}`);
});

function getUser(email: string): [User, number] | [undefined, number] {
    let targetUser: User;
    let index;

    for (index = 0; index < users.length; index++) {
        const user = users[index];
        if (user.email === email) {
            targetUser = user;
            break;
        }
    }

    return [targetUser, index];
}

function getStore(id: number): [Store, number] | [undefined, number] {
    let targetStore: Store;
    let index;

    for (index = 0; index < stores.length; index++) {
        const store = stores[index];
        if (store.id === id) {
            targetStore = store;
            break;
        }
    }

    return [targetStore, index];
}

function getItem(store: Store, itemId: number): [Item, number] | [undefined, number] {
    let targetItem: Item;
    let index;

    for (index = 0; index < store.items.length; index++) {
        const item = store.items[index];
        if (item.id === itemId) {
            targetItem = item;
            break;
        }
    }

    return [targetItem, index];
}
