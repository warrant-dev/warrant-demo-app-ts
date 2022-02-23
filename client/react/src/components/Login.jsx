import React, { useCallback, useState } from "react";
import Axios from "axios";
import styled from "styled-components";
import { useHistory } from "react-router";
import { useWarrant } from "@warrantdev/react-warrant-js";
import PageWrapper from "./PageWrapper";

const Login = () => {
    const [email, setEmail] = useState("");
    const history = useHistory();
    const { setSessionToken } = useWarrant();

    const handleEmailUpdated = (event) => {
        setEmail(event.target.value);
    }

    const login = useCallback(async (event) => {
        event.preventDefault();

        try {
            const response = await Axios.post("http://localhost:3000/api/login", {
                email,
            });

            // Pass along the sessionId to the Warrant React SDK
            setSessionToken(response.data.warrantSessionToken);

            history.replace("/stores");
        } catch (e) {
            console.log("Error while logging in", e);
        }
    }, [email]);

    return <PageWrapper>
        <LoginForm onSubmit={login}>
            <h2>Demo App</h2>
            <EmailInput
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailUpdated}
                required
            />
            <SubmitButton type="submit">Log In</SubmitButton>
        </LoginForm>
        <UserList>
            <h3>Users</h3>
            {/* <h4>ceo@demoapp-inc.com (15) - Super Admin</h4> */}
            {/* <h4>jane@demoapp-inc.com (34) - Super Admin</h4> */}
            <h4>tony@starkindustries.com - Admin</h4>
            <h4>pepper.potts@starkindustries.com - Merchandise Buyer</h4>
            <h4>michael.scott@dundermifflin.com - Admin</h4>
            <h4>pamela.beesly@dundermifflin.com - Merchandise Buyer</h4>
            <h4>ryan.howard@dundermifflin.com - Shopper</h4>
        </UserList>
    </PageWrapper>;
}

const LoginForm = styled.form`
    max-width: 250px;
    margin: auto;
    margin-top: 15%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
`;

const EmailInput = styled.input`
    width: 243px;
    height: 28px;
    padding: 0;
    padding-left: 5px;

    font-size: 16px;
    line-height: 20px;
    border: 1px solid gray;
    border-radius: 4px;
`;

const SubmitButton = styled.button`
    width: 100%;

    cursor: pointer;

    margin-top: 8px;
    padding: 8px;
    color: white;
    background-color: green;
    border-radius: 4px;
    border: none;

    &:hover {
        background-color: darkgreen;
    }
`;

const UserList = styled.div`
    margin: 35px auto;
    text-align: center;
`;

export default Login;
