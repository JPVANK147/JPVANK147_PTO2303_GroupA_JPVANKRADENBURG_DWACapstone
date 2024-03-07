import React from "react"
import Header from "./components/header";
import List from "./components/list";
import "./style.css"

function App() {
  return (
      <div>
          <Header />
          <List />
      </div>
  )
}

export default App;

/*
import React, { useState, useEffect } from "react";
import Header from "./components/header";
import List from "./components/list";
import "./style.css";

function App() {
    const [showData, setShowData] = useState([]);

    useEffect(() => {
        fetch("https://podcast-api.netlify.app/shows")
            .then(res => res.json())
            .then(data => setShowData(data))
            .catch(error => console.error('Error fetching show data:', error));
    }, []);

    return (
        <div>
            <Header />
            <List showData={showData} />
        </div>
    );
}

export default App;
*/