import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Axios from "axios";
import { Link } from "react-router-dom";

const Store = () => {
    const { storeId } = useParams();
    const [store, setStore] = useState();
    const [canEditStore, setCanEditStore] = useState(false);

    useEffect(() => {
        const getStore = async () => {
            try {
                const response = await Axios.get(`http://localhost:8000/api/stores/${storeId}`);
                setStore(response.data);
            } catch (e) {
                console.log("Error getting store", e);
            }
        };

        const getCanEditStore = async () => {
            try {
                const response = await Axios.get(`http://localhost:8000/api/stores/${storeId}/edit`)
                if (response.status === 200) {
                    setCanEditStore(true);
                }
            } catch (e) {
                if (e.response.status !== 401) {
                    console.log("Error checking if can edit store", e);
                }
            }
        };

        getStore();
        getCanEditStore();
    }, []);

    if (!store) {
        return null;
    }

    return <StorePageWrapper>
        <StoreTitle>{store.name}</StoreTitle>
        {canEditStore && <EditButton to={`/stores/${storeId}/edit`}>Edit Store</EditButton>}
        <ItemList>
            {store.items.map((item) => <Item key={item.id}>
                <Link to={`/stores/${storeId}/items/${item.id}`}><h3>{item.name} - ${item.price}</h3></Link>
                <p>{item.description}</p>
            </Item>)}
        </ItemList>
    </StorePageWrapper>;
};

const StorePageWrapper = styled.div`
    margin: auto;
`;

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
