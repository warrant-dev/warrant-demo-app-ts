import React, { useCallback, useState } from "react";
import Axios from "axios";
import styled from "styled-components";
import { useHistory } from "react-router";

const Login = () => {
    const [email, setEmail] = useState("");
    const history = useHistory();

    const handleEmailUpdated = (event) => {
        setEmail(event.target.value);
    };

    const login = useCallback(async (event) => {
        event.preventDefault();

        try {
            await Axios.post("http://localhost:8000/api/login", {
                email,
            });

            history.push("/stores");
        } catch (e) {
            console.log("Error while logging in", e);
        }
    }, [email]);

    return <LoginPageWrapper>
        <LoginWrapper onSubmit={login}>
            <h2>Store Buddy</h2>
            <EmailInput
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailUpdated}
                required
            />
            <SubmitButton type="submit">Log In</SubmitButton>
        </LoginWrapper>
        <UserList>
            <h3>Users</h3>
            <h4>admin@storebuddy.com - Customer Support (Admin)</h4>
            <h4>tony@starkindustries.com - Store Owner</h4>
            <h4>michael.scott@dundermifflin.com - Store Owner</h4>
            <h4>johndoe@gmail.com - Shopper</h4>
        </UserList>
    </LoginPageWrapper>;
};

const LoginPageWrapper = styled.div`
    margin: auto;
`;

const LoginWrapper = styled.form`
    max-width: 350px;
    margin: auto;
    margin-top: 15%;
    height: 100%;
`;

const EmailInput = styled.input`
    width: 250px;
`;

const SubmitButton = styled.button`
    width: 55px;
    margin-left: 5px;
`;

const UserList = styled.div`
    margin: 35px auto;
    text-align: center;
`;

export default Login;
