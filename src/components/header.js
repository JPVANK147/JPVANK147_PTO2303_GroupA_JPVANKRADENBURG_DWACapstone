import React from "react";

function Header() {
    return (
        <header className="header">
            <img className="header-image" src={require("../images/podcast.png")} />
            <h3 className="header-title" >Podcast</h3>
        </header>
    )
}

export default Header

//"https://cdn-icons-mp4.flaticon.com/512/8720/8720265.mp4"