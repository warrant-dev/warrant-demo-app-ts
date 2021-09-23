# Warrant Demo Application

[![Discord](https://img.shields.io/discord/865661082203193365?label=discord)](https://discord.gg/QNCMKWzqET)

## Create object types
```bash
curl "https://api.warrant.dev/v1/object-types" \
    -X POST \
    -H "Authorization: ApiKey YOUR_KEY" \
    --data-raw \
    '{
        "type": "group",
        "relations": {
            "member": {}
        }
    }'
```
```bash
curl "https://api.warrant.dev/v1/object-types" \
    -X POST \
    -H "Authorization: ApiKey YOUR_KEY" \
    --data-raw \
    '{
        "type": "store",
        "relations": {
            "owner": {},
            "creator": {},
            "editor": {
                "type": "anyOf",
                "rules": [
                    {
                        "type": "userset",
                        "relation": "owner"
                    }
                ]
            },
            "viewer": {
                "type": "anyOf",
                "rules": [
                    {
                        "type": "userset",
                        "relation": "editor"
                    }
                ]
            }
        }
    }'
```
```bash
curl "https://api.warrant.dev/v1/object-types" \
    -X POST \
    -H "Authorization: ApiKey YOUR_KEY" \
    --data-raw \
    '{
        "type": "item",
        "relations": {
            "parent_store": {},
            "creator": {},
            "editor": {
                "type": "anyOf",
                "rules": [
                    {
                        "type": "objectUserset",
                        "relation": "parent_store",
                        "userset": {
                            "type": "userset",
                            "relation": "editor"
                        }
                    }
                ]
            },
            "viewer": {
                "type": "anyOf",
                "rules": [
                    {
                        "type": "userset",
                        "relation": "editor"
                    }
                ]
            }
        }
    }'
```

## API Key
Replace occurences of `<replace_with_your_api_key>` in `/api/src/index.ts` and `/api/src/scripts/initializeData.js` with your API Key.

Replace occurence of `<replace_with_your_client_key>` in `/client/src/App.jsx` with your Client Key.

## Server (Express)
```bash
cd api
npm install
npm run init # only required the first time you setup the app
npm run start
```

## Client (React)
```bash
cd client/react
npm install
npm run dev
```

## Client (Vue)
```bash
cd client/vue
npm install
npm run serve
```
