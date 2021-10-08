const Warrant = require("@warrantdev/warrant-node");
const users = require("../../users.json");
const warrants = require("../../warrants.json");
const warrantClient = new Warrant.Client("api_test_ZpJcbKyo6ofhL-sD8zFfTlL1cG6Dtg-k78QVwSMhMds=");

(async () => {
    // Create users in Warrant
    console.log("Creating users in Warrant");
    for (const user of users) {
        try {
            await warrantClient.createUser(user.id.toString());
        } catch (e) {
            console.log("Unable to create user", user);

            process.exit(1);
        }
    }

    // Create warrants in Warrant
    console.log("Creating warrants in Warrant");
    for (const warrant of warrants) {
        try {
            await warrantClient.createWarrant(warrant.objectType, warrant.objectId, warrant.relation, warrant.user);
        } catch (e) {
            console.log("Unable to create warrant", warrant);

            process.exit(1);
        }
    }
})();
