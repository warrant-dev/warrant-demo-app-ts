import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import { WarrantProvider, ProtectedRoute, WARRANT_IGNORE_ID } from "@warrantdev/react-warrant-js";

import Login from "./components/Login";
import Stores from "./components/Stores";
import Store from "./components/Store";
import EditStore from "./components/EditStore";
import Item from "./components/Item";
import NavBar from "./components/NavBar";

const history = createBrowserHistory();

const App = () => {
    return <>
        <WarrantProvider clientKey="<replace_with_your_client_key>">
            <Router history={history}>
                <NavBar/>
                <Switch>
                    <Route path="/" exact>
                        <Redirect to="/login"/>
                    </Route>
                    <Route path="/login" exact component={Login}/>
                    <ProtectedRoute
                        path="/stores/:storeId/items/:itemId"
                        key="/stores/:storeId/items/:itemId"
                        exact
                        component={Item}
                        options={{
                            objectType: "item",
                            objectIdParam: "itemId",
                            relation: "view",
                            redirectTo: "/",
                        }}
                    />
                    <ProtectedRoute
                        path="/stores/:storeId/edit"
                        key="/stores/:storeId/edit"
                        exact
                        component={EditStore}
                        options={{
                            objectType: "store",
                            objectIdParam: "storeId",
                            relation: "edit",
                            redirectTo: "/",
                        }}
                    />
                    <ProtectedRoute
                        path="/stores/:storeId"
                        key="/stores/:storeId"
                        exact
                        component={Store}
                        options={{
                            objectType: "store",
                            objectIdParam: "storeId",
                            relation: "view",
                            redirectTo: "/",
                        }}
                    />
                    <ProtectedRoute
                        path="/stores"
                        key="/stores"
                        exact
                        component={Stores}
                        options={{
                            objectType: "store",
                            objectIdParam: WARRANT_IGNORE_ID,
                            relation: "view",
                            redirectTo: "/",
                        }}
                    />
                </Switch>
            </Router>
        </WarrantProvider>
    </>;
};

export default App;
