import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Axios from "axios";
import { Link } from "react-router-dom";
import PageWrapper from "./PageWrapper";
import { ProtectedComponent } from "@warrantdev/react-warrant-js";

const Stores = () => {
    const [stores, setStores] = useState([]);

    useEffect(() => {
        const getStores = async () => {
            try {
                const response = await Axios.get("http://localhost:3000/api/stores");
                setStores(response.data);
            } catch (e) {
                console.log("Error getting stores", e);
            }
        };

        getStores();
    }, []);

    const createWarrantSelfServiceSession = async () => {
        try {
            const response = await Axios.post("http://localhost:3000/api/create-warrant-session");
            window.location.href = response.data.warrantSelfServiceDashUrl;
        } catch (e) {
            console.log("Error creating Warrant self service dash session", e);
        }
    };

    if (stores.length === 0) {
        return null;
    }

    return <PageWrapper>
        <StoreList>
            <ProtectedComponent
                objectType="permission"
                objectId="view-self-service-dashboard"
                relation="member"
            >
                <ManageUsersButton onClick={createWarrantSelfServiceSession}>Manage Users</ManageUsersButton>
            </ProtectedComponent>
            <h2>Stores</h2>
            {stores.map((store) => <StoreLink to={`/stores/${store.id}`} key={store.id}>
                <Store><h3>{store.name}{/* - {store.items.length} Items*/}</h3></Store>
            </StoreLink>)}
        </StoreList>
    </PageWrapper>;
};

const StoreList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;

    height: 100%;
`;

const Store = styled.div`
    min-width: 350px;
    border-radius: 5px;
    border: 1px solid gray;
    padding: 0 15px;

    &:hover {
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    }
`;

const StoreLink = styled(Link)`
    text-decoration: none;
    color: black;
`;

const ManageUsersButton = styled.button`
    margin: auto;
    padding: 12px;
    border-radius: 5px;
    border: none;
    border: 1px solid #efefef;
    cursor: pointer;

    &:hover {
        border: 1px solid black;
    }
`;

export default Stores;
