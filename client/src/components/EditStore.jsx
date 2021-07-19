import React, { useCallback, useEffect, useState } from "react";
import Axios from "axios";
import styled from "styled-components";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import PageWrapper from "./PageWrapper";

const EditStore = () => {
    const { storeId } = useParams();
    const [store, setStore] = useState({name: ""});
    const history = useHistory();

    useEffect(() => {
        const getStore = async () => {
            try {
                const response = await Axios.get(`http://localhost:5000/api/stores/${storeId}`);
                setStore(response.data);
            } catch (e) {
                console.log("Error getting store", e);
            }
        };

        getStore();
    }, []);

    const handleNameUpdated = useCallback((event) => {
        setStore({
            ...store,
            name: event.target.value,
        });
    }, [store]);

    const saveStore = useCallback(async (event) => {
        event.preventDefault();

        try {
            await Axios.post(`http://localhost:5000/api/stores/${storeId}`, {
                name: store.name,
            });

            history.push("/stores");
        } catch (e) {
            console.log("Error while updating store", e);
        }
    }, [store]);

    return <PageWrapper>
        <Title>Edit Store</Title>
        <EditForm onSubmit={saveStore}>
            <NameInput
                id="name"
                type="text"
                placeholder="Name"
                value={store.name}
                onChange={handleNameUpdated}
                required
            />
            <SubmitButton type="submit">Save</SubmitButton>
        </EditForm>
    </PageWrapper>;
};

const Title = styled.h2`
    text-align: center;
`;

const EditForm = styled.form`
    max-width: 350px;
    margin: auto;
    height: 100%;
`;

const NameInput = styled.input`
    width: 250px;
`;

const SubmitButton = styled.button`
    width: 55px;
    margin-left: 5px;
`;

export default EditStore;
