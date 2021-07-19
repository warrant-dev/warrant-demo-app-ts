import express, { Request, Response, NextFunction} from "express";
import {Client as Warrant, WARRANT_IGNORE_ID} from "@warrantdev/warrant-node";
import cors from "cors";

import User from "./types/User";
import Store from "./types/Store";
import Item from "./types/Item";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

//
// JSON Data
// NOTE: This pattern is just for demo purposes and
// should not be replicated in a production application.
// Use a database to persist your application data.
//
let users: User[] = [
    {
        id: 15,
        email: "ceo@demoapp-inc.com",
        firstName: "CEO",
        lastName: "Company Inc.",
    },
    {
        id: 34,
        email: "jane@demoapp-inc.com",
        firstName: "Jane",
        lastName: "Doe",
    },
    {
        id: 7409,
        email: "tony@starkindustries.com",
        firstName: "Anthony",
        lastName: "Stark",
    },
    {
        id: 12107,
        email: "johndoe@gmail.com",
        firstName: "John",
        lastName: "Doe",
    },
    {
        id: 38265,
        email: "michael.scott@dundermifflin.com",
        firstName: "Michael",
        lastName: "Scott",
    },
];

let stores: Store[] = [
    {
        id: 1053,
        userId: 38265,
        name: "Michael Scott Paper Company",
        items: [
            {
                id: 50187,
                storeId: 1053,
                name: "Standard 8.5x11 White Paper (500 sheets)",
                description: "One ream of our standard quality 8.5in x 11in white paper",
                price: 4.99,
            },
            {
                id: 50194,
                storeId: 1053,
                name: "High Quality 8.5x11 White Paper (500 sheets)",
                description: "One ream of our highest quality 8.5in x 11in glossy white paper",
                price: 6.99,
            },
            {
                id: 50205,
                storeId: 1053,
                name: "Standard 8.5x11 White Paper (10 x 500 sheets)",
                description: "10 reams of our standard quality 8.5in x 11in white paper",
                price: 45.99,
            },
        ],
    },
    {
        id: 324,
        userId: 7409,
        name: "Iron Man Memorabilia Store",
        items: [
            {
                id: 1098,
                storeId: 324,
                name: "Arc Reactor Prototype",
                description: "An exact replica of the Arc Reactor prototype Tony built to keep shrapnel from reaching his heart",
                price: 124.99,
            },
            {
                id: 1257,
                storeId: 324,
                name: "Iron Man (Mk I)",
                description: "An exact replica of the Mk I Iron Man suit Tony built to escape his kidnappers",
                price: 799.99,
            },
            {
                id: 1260,
                storeId: 324,
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
// Use secure methods of authentication and sharing
// secrets with your application.
//
const warrantApiKey = "<replace_with_your_api_key>";
let loggedInUserId: number | null = null;

function getLoggedInUserId(): string {
    return loggedInUserId.toString();
}

//
// Authorization Middleware
//
function authorization(objectType: string, objectIdParam: string, relations: string[], getCurrentUserId: () => string) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const warrant = new Warrant(warrantApiKey);
        const objectId = req.params[objectIdParam];

        for (const relation of relations) {
            if (await warrant.isAuthorized(objectType, objectId, relation, getCurrentUserId().toString())) {
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
    const [user, _] = getUserByEmail(email);

    if (!user) {
        res.sendStatus(401);
        return;
    }

    loggedInUserId = user.id;

    try {
        // Create a Warrant session token for the user
        const warrantSessionToken = await new Warrant(warrantApiKey).createSession(loggedInUserId.toString());

        // Return the Warrant session token to
        // the UI so we can use it to initialize
        // the Warrant React SDK.
        res.json({
            warrantSessionToken,
        });
        return;
    } catch (e) {
        console.log(e);
        res.sendStatus(401);
        return;
    }
});

//
// Store Routes
//
app.get("/api/stores", authorization("store", WARRANT_IGNORE_ID, ["view"], getLoggedInUserId), (req: Request, res: Response): void => {
    res.json(stores);
});

app.get("/api/stores/:storeId", authorization("store", "storeId", ["view"], getLoggedInUserId), (req: Request, res: Response): void => {
    const storeId = parseInt(req.params.storeId);
    const [store, _] = getStore(storeId);

    if (!store) {
        res.sendStatus(404);
        return;
    }

    res.json(store);
});

app.post("/api/stores/:storeId", authorization("store", "storeId", ["edit"], getLoggedInUserId), (req: Request, res: Response): void => {
    const storeId = parseInt(req.params.storeId);
    console.log(storeId)
    const [store, index] = getStore(storeId);
    const [loggedInUser, _] = getUserById(loggedInUserId);

    if (!store || store.userId !== loggedInUser.id) {
        res.sendStatus(404);
        return;
    }

    let updatedStore = {...store};
    updatedStore.name = req.body.name;
    stores[index] = updatedStore;

    res.json(updatedStore);
});

//
// Item Routes
//
app.get("/api/stores/:storeId/items/:itemId", authorization("item", "itemId", ["view"], getLoggedInUserId), (req: Request, res: Response): void => {
    const storeId = parseInt(req.params.storeId);
    const itemId = parseInt(req.params.itemId);

    const [store, _storeIndex] = getStore(storeId);
    if (!store) {
        res.sendStatus(404);
        return;
    }

    const [item, _itemIndex] = getItem(store, itemId);
    if (!item) {
        res.sendStatus(404);
        return;
    }

    res.json(item);
});

app.post("/api/stores/:storeId/items/:itemId", authorization("item", "itemId", ["edit"], getLoggedInUserId), (req: Request, res: Response): void => {
    const storeId = parseInt(req.params.storeId);
    const itemId = parseInt(req.params.itemId);
    const [store, storeIndex] = getStore(storeId);
    const [loggedInUser] = getUserById(loggedInUserId);

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
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}. API available at http://localhost:${port}`);
});

function getUserByEmail(email: string): [User, number] | [undefined, number] {
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

function getUserById(id: number): [User, number] | [undefined, number] {
    let targetUser: User;
    let index;

    for (index = 0; index < users.length; index++) {
        const user = users[index];
        if (user.id === id) {
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
