import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import Login from "./components/Login";
import Stores from "./components/Stores";
import Store from "./components/Store";
import EditStore from "./components/EditStore";
import NavBar from "./components/NavBar";

const history = createBrowserHistory();

const App = () => {
    return <>
        <Router history={history}>
            <NavBar/>
            <Switch>
                <Route path="/" exact>
                    <Redirect to="/login"/>
                </Route>
                <Route path="/login" exact component={Login}/>
                <Route path="/stores" exact component={Stores}/>
                <Route path="/stores/:storeId/edit" exact component={EditStore}/>
                <Route path="/stores/:storeId" exact component={Store}/>
            </Switch>
        </Router>
    </>;
};

export default App;
