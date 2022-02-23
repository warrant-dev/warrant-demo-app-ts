import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import Axios from "axios";
import { ProtectedComponent } from "@warrantdev/react-warrant-js";
import PageWrapper from "./PageWrapper";

const Store = () => {
    const { storeId } = useParams();
    const [store, setStore] = useState();
    const [items, setItems] = useState([]);

    useEffect(() => {
        const getStore = async () => {
            try {
                const response = await Axios.get(`http://localhost:3000/api/stores/${storeId}`);
                setStore(response.data);
            } catch (e) {
                console.log("Error getting store", e);
            }
        };
        const getItems = async () => {
            try {
                const response = await Axios.get(`http://localhost:3000/api/stores/${storeId}/items`);
                setItems(response.data);
            } catch (e) {
                console.log("Error getting items", e);
            }
        };

        getStore();
        getItems();
    }, []);

    if (!store) {
        return null;
    }

    return <PageWrapper>
        <StoreTitle>{store.name}</StoreTitle>
        <ProtectedComponent objectType="store" objectId={storeId} relation="editor">
            <EditButton to={`/stores/${storeId}/edit`}>Edit Store</EditButton>
        </ProtectedComponent>
        <ItemList>
            {items.map((item) => <Item key={item.id}>
                <Link to={`/stores/${storeId}/items/${item.id}`}><h3>{item.name} - ${item.price}</h3></Link>
                <p>{item.description}</p>
            </Item>)}
        </ItemList>
    </PageWrapper>;
};

const StoreTitle = styled.h2`
    text-align: center;
`;

const EditButton = styled(Link)`
    text-decoration: none;
    color: black;
    border: 1px solid gray;
    border-radius: 5px;
    padding: 5px;
    display: block;
    margin: 10px auto;
    width: 72px;
`;

const ItemList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;

    height: 100%;
`;

const Item = styled.div`
    min-width: 275px;
    max-width: 350px;

    border-radius: 5px;
    border: 1px solid gray;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

    padding: 0 15px;
`;

export default Store;
