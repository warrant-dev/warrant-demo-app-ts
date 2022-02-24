const mysql = require("mysql2/promise");
const Warrant = require("@warrantdev/warrant-node");
const warrant = new Warrant.Client("<replace_with_your_api_key>");
const stores = [
    {
        name: "Storify",
        users: [
            {
                email: "ceo@storify-inc.com",
                firstName: "Storify",
                lastName: "CEO"
            },
            {
                email: "jane@storify-inc.com",
                firstName: "Jane",
                lastName: "Doe"
            }
        ],
        items: []
    },
    {
        name: "Michael Scott Paper Company",
        users: [
            {
                email: "michael.scott@dundermifflin.com",
                firstName: "Michael",
                lastName: "Scott"
            },
            {
                email: "pamela.beesly@dundermifflin.com",
                firstName: "Pamela",
                lastName: "Beesly"
            },
            {
                email: "ryan.howard@dundermifflin.com",
                firstName: "Ryan",
                lastName: "Howard"
            }
        ],
        items: [
            {
                name: "Standard 8.5x11 White Paper (500 sheets)",
                description: "One ream of our standard quality 8.5in x 11in white paper",
                price: 4.99
            },
            {
                name: "High Quality 8.5x11 White Paper (500 sheets)",
                description: "One ream of our highest quality 8.5in x 11in glossy white paper",
                price: 6.99
            },
            {
                name: "Standard 8.5x11 White Paper (10 x 500 sheets)",
                description: "10 reams of our standard quality 8.5in x 11in white paper",
                price: 45.99
            }
        ]
    },
    {
        id: "iron-man-memorabilia",
        name: "Iron Man Memorabilia Store",
        users: [
            {
                email: "tony@starkindustries.com",
                firstName: "Anthony",
                lastName: "Stark"
            },
            {
                email: "pepper.potts@starkindustries.com",
                firstName: "Pepper",
                lastName: "Potts"
            }
        ],
        items: [
            {
                name: "Arc Reactor Prototype",
                description: "An exact replica of the Arc Reactor prototype Tony built to keep shrapnel from reaching his heart",
                price: 124.99
            },
            {
                name: "Iron Man (Mk I)",
                description: "An exact replica of the Mk I Iron Man suit Tony built to escape his kidnappers",
                price: 799.99
            },
            {
                name: "Flight Stabilizer",
                description: "A handheld flight stabilizer capable of releasing a concussive blast",
                price: 1249.99
            }
        ]
    }
];


(async () => {
    try {
        const db = await mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "",
        });

        db.connect();

        await db.execute("CREATE DATABASE IF NOT EXISTS storify");

        await db.execute(`
            CREATE TABLE storify.stores (
                id INTEGER AUTO_INCREMENT,
                name TEXT NOT NULL,
                PRIMARY KEY (id)
            )
        `);

        await db.execute(`
            CREATE TABLE storify.users (
                id INTEGER AUTO_INCREMENT,
                email VARCHAR(255) NOT NULL,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL,
                storeId INTEGER,
                FOREIGN KEY (storeId) REFERENCES stores (id),
                UNIQUE(email),
                PRIMARY KEY (id)
            )
    `   );

        await db.execute(`
            CREATE TABLE storify.items (
                id INTEGER AUTO_INCREMENT,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                price DECIMAL(13, 2) NOT NULL,
                storeId INTEGER,
                FOREIGN KEY (storeId) REFERENCES stores (id),
                PRIMARY KEY (id)
            )
        `);

        // Create stores (tenants), items, and users in SQL DB & Warrant
        for (const store of stores) {
            const storeResult = await db.execute("INSERT INTO storify.stores (name) VALUES (?)", [store.name]);

            // Create tenant for store in Warrant
            const storeId = storeResult[0].insertId.toString();
            // await warrant.createTenant(storeId);

            for (const user of store.users) {
                const userResult = await db.execute("INSERT INTO storify.users (email, firstName, lastName, storeId) VALUES (?, ?, ?, ?)", [
                    user.email,
                    user.firstName,
                    user.lastName,
                    storeId,
                ]);

                const userId = userResult[0].insertId.toString();
                // await warrant.createUser(user.email, userId, storeId);
            }

            for (const item of store.items) {
                const itemResult = await db.execute("INSERT INTO storify.items (name, description, price, storeId) VALUES (?, ?, ?, ?)", [
                    item.name,
                    item.description,
                    item.price,
                    storeResult[0].insertId,
                ]);
            }
        }

        // // Create permissions in Warrant
        // await warrant.createPermission("view-stores");
        // await warrant.createPermission("edit-stores");
        // await warrant.createPermission("view-items");
        // await warrant.createPermission("edit-items");

        // // Create roles in Warrant
        // await warrant.createRole("basic");
        // await warrant.createWarrant("permission", "view-stores", "member", {
        //     objectType: "role",
        //     objectId: "basic",
        //     relation: "member"
        // });
        // await warrant.createWarrant("permission", "view-items", "member", {
        //     objectType: "role",
        //     objectId: "basic",
        //     relation: "member"
        // });

        // await warrant.createRole("store-manager");
        // await warrant.createWarrant("role", "basic", "member", {
        //     objectType: "role",
        //     objectId: "store-manager",
        //     relation: "member"
        // });
        // await warrant.createWarrant("permission", "edit-stores", "member", {
        //     objectType: "role",
        //     objectId: "store-manager",
        //     relation: "member"
        // });
        // await warrant.createWarrant("permission", "edit-items", "member", {
        //     objectType: "role",
        //     objectId: "store-manager",
        //     relation: "member"
        // });

        // await warrant.createWarrant("role", "store-manager", "member", {
        //     objectType: "role",
        //     objectId: "admin",
        //     relation: "member"
        // });

        db.end();
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
})();
