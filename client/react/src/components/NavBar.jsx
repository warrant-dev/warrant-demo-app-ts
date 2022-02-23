import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const NavBar = () => {
    return <NavBarWrapper>
        <Logo to="/">Storify</Logo>
    </NavBarWrapper>;
};

const NavBarWrapper = styled.div`
    height: 64px;
    width: calc(100vw - 30px);
    padding: 0 15px;

    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Logo = styled(Link)`
    text-decoration: none;
    color: black;
    font-size: 28px;
`;

export default NavBar;
