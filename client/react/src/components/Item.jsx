import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import Axios from "axios";
import PageWrapper from "./PageWrapper";

const Item = () => {
    const { storeId, itemId } = useParams();
    const [item, setItem] = useState();

    useEffect(() => {
        const getItem = async () => {
            try {
                const response = await Axios.get(`http://localhost:3000/api/stores/${storeId}/items/${itemId}`);
                setItem(response.data);
            } catch (e) {
                console.log("Error getting item", e);
            }
        };

        getItem();
    }, []);

    if (!item) {
        return null;
    }

    return <PageWrapper>
        <ItemTitle>{item.name}</ItemTitle>
        <ItemDescription>{item.description}</ItemDescription>
    </PageWrapper>;
};

const ItemTitle = styled.h2`
    text-align: center;
`;

const ItemDescription = styled.p`
    text-align: center;
`;

export default Item;
