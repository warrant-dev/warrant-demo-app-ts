import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Axios from "axios";
import { Link } from "react-router-dom";
import PageWrapper from "./PageWrapper";

const Stores = () => {
    const [stores, setStores] = useState([]);

    useEffect(() => {
        const getStores = async () => {
            try {
                const response = await Axios.get("http://localhost:5000/api/stores");
                setStores(response.data);
            } catch (e) {
                console.log("Error getting stores", e);
            }
        };

        getStores();
    }, []);

    if (stores.length === 0) {
        return null;
    }

    return <PageWrapper>
        <StoreList>
            <h2>Stores</h2>
            {stores.map((store) => <Link to={`/stores/${store.id}`} key={store.id}>
                <Store><h3>{store.name} - {store.items.length} Items</h3></Store>
            </Link>)}
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
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

    padding: 0 15px;
`;

export default Stores;
