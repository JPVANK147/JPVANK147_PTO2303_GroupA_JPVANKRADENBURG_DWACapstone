import React from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';

function Header() {
    const navigate = useNavigate();
    
    const handelFavouritesPage = () => {
        navigate("/favourite")
    };

    return (
        <header className="header">
            <img className="header-image" alt="podcast" src={require("../images/podcast-audio.png")} />
            <h3 className="header-title">PODCAST</h3>
            <Button onClick={handelFavouritesPage} variant="contained" color="secondary">
                Favourites
            </Button>
        </header>
    );
};

export default Header;