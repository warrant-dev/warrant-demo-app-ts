import express, { NextFunction, Request, Response } from "express";
import { Client as Warrant } from "@warrantdev/warrant-node";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

import User from "./types/User";
import Store from "./types/Store";
import Item from "./types/Item";

let db: Database<sqlite3.Database, sqlite3.Statement>;
(async () => {
    db = await open({
        filename: "./db/storify.db",
        driver: sqlite3.Database,
    });
})();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

//
// Global Variables
// NOTE: This pattern is just for demo purposes and
// should not be replicated in a production application.
// Use secure methods of authentication and sharing
// secrets with your application.
//
const warrantApiKey = "<replace_with_your_api_key>";
let loggedInUserId: number | null = null;

//
// Authorization Middleware
//
// const authorize = createMiddleware({
//     clientKey: warrantApiKey,
//     getUserId: () => loggedInUserId.toString(),
//     getParam: (req: Request, paramName: string) => paramName,
// });

const authorize = (objectType: string, objectId: string, relation: string) => {
    return async (req: Request, res: Response, next?: NextFunction) => {
        const userId = loggedInUserId;
        if (userId === null) {
            res.sendStatus(401);
            return;
        }

        const warrant = new Warrant(warrantApiKey);
        if (await warrant.isAuthorized(objectType, objectId, relation, userId.toString())) {
            if (next) {
                next();
            }

            return;
        }

        res.sendStatus(401);
    };
};

//
// Authentication Routes
//
app.post("/api/login", async (req: Request, res: Response): Promise<void> => {
    const email = req.body.email;

    try {
        const user = await getUserByEmail(email);

        if (!user) {
            res.sendStatus(401);
            return;
        }

        loggedInUserId = user.id;

        // Create a Warrant session token for the user
        const warrant = new Warrant(warrantApiKey);
        const warrantSessionToken = await warrant.createSession(loggedInUserId.toString());

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
// Warrant Session Route
//
app.post("/api/create-warrant-session", authorize("permission", "view-self-service-dashboard", "member"), async (req: Request, res: Response): Promise<void> => {
    try {
        const warrant = new Warrant(warrantApiKey);
        const warrantSelfServiceDashUrl = await warrant.createSelfServiceSession(loggedInUserId.toString(), "http://localhost:5050/stores");

        res.json({
            warrantSelfServiceDashUrl,
        });
    } catch (e) {
        res.sendStatus(500);
        return;
    }
});

//
// Store Routes
//
app.get("/api/stores", authorize("permission", "view-stores", "member"), async (req: Request, res: Response): Promise<void> => {
    try {
        const stores = await getStores();

        res.json(stores);
    } catch (e) {

    }
});

app.get("/api/stores/:storeId", authorize("permission", "view-stores", "member"), async (req: Request, res: Response): Promise<void> => {
    const storeId = parseInt(req.params.storeId);

    try {
        const store = await getStore(storeId);

        if (!store) {
            res.sendStatus(404);
            return;
        }

        res.json(store);
    } catch (e) {

    }
});

app.post("/api/stores/:storeId", authorize("permission", "edit-stores", "member"), async (req: Request, res: Response): Promise<void> => {
    const storeId = parseInt(req.params.storeId);

    try {
        const store = await getStore(storeId);

        if (!store) {
            res.sendStatus(404);
            return;
        }

        await updateStoreName(storeId, req.body.name);

        res.json({
            ...store,
            name: req.body.name,
        });
    } catch (e) {

    }
});

//
// Item Routes
//
app.get("/api/stores/:storeId/items", authorize("permission", "view-items", "member"), async (req: Request, res: Response): Promise<void> => {
    const storeId = parseInt(req.params.storeId);

    try {
        const store = await getStore(storeId);
        if (!store) {
            res.sendStatus(404);
            return;
        }

        const items = await getItems(storeId);
        res.json(items);
    } catch (e) {

    }
});

app.get("/api/stores/:storeId/items/:itemId", authorize("permission", "view-items", "member"), async (req: Request, res: Response): Promise<void> => {
    const storeId = parseInt(req.params.storeId);
    const itemId = parseInt(req.params.itemId);

    try {
        const item = await getItem(storeId, itemId);

        if (!item) {
            res.sendStatus(404);
            return;
        }

        res.json(item);
    } catch (e) {

    }
});

// app.post("/api/stores/:storeId/items/:itemId", authorize("permission", "edit-items", "member"), (req: Request, res: Response): void => {
//     const storeId = parseInt(req.params.storeId);
//     const itemId = parseInt(req.params.itemId);
//     const [store, storeIndex] = getStore(storeId);

//     if (!store) {
//         res.sendStatus(404);
//         return;
//     }

//     const [item, itemIndex] = getItem(store, itemId);
//     if (!item) {
//         res.sendStatus(404);
//         return;
//     }

//     let updatedItem = { ...item };
//     updatedItem.name = req.body.name;
//     updatedItem.description = req.body.description;
//     updatedItem.price = req.body.price;
//     stores[storeIndex].items[itemIndex] = updatedItem;

//     res.json(updatedItem);
// });

const port = 3000;
app.listen(port, async () => {
    console.log(`Server listening on port ${port}. API available at http://localhost:${port}`);
});

async function getUserByEmail(email: string): Promise<User> {
    return db.get<User>("SELECT * FROM users WHERE email = :email", {
        ":email": email,
    });
}

async function getStores(): Promise<Store[]> {
    return db.all<Store[]>("SELECT * FROM stores");
}

async function getStore(id: number): Promise<Store> {
    return db.get<Store>("SELECT * FROM stores WHERE id = :id", {
        ":id": id,
    });
}

async function updateStoreName(id: number, updatedName: string): Promise<void> {
    db.run("UPDATE stores SET name = :name WHERE id = :id", {
        ":id": id,
        ":name": updatedName,
    });
};

async function getItems(storeId: number): Promise<Item[]> {
    return db.all<Item[]>("SELECT * FROM items WHERE storeId = :storeId", {
        ":storeId": storeId,
    });
}

async function getItem(storeId: number, itemId: number): Promise<Item> {
    return db.get<Item>("SELECT * FROM items WHERE storeId = :storeId AND itemId = :itemId", {
        ":storeId": storeId,
        ":itemId": itemId,
    });
}
