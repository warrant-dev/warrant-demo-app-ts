import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import { WarrantProvider } from "@warrantdev/react-warrant-js";

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
                    <Route path="/stores/:storeId/items/:itemId" exact component={Item}/>
                    <Route path="/stores/:storeId/edit" exact component={EditStore}/>
                    <Route path="/stores/:storeId" exact component={Store}/>
                    <Route path="/stores" exact component={Stores}/>
                </Switch>
            </Router>
        </WarrantProvider>
    </>;
};

export default App;
