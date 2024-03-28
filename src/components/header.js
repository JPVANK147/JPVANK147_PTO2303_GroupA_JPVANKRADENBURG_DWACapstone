import React from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';

// A function for the Header component
function Header() {
    // Hook for navigation
    const navigate = useNavigate();

    // Event handler to navigate to the Favourites page
    const handelFavouritesPage = () => {
        navigate("/favourite");
    };

    // Rendering the Header component
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

// Exporting the Header component to be used elsewhere
export default Header;