import React from "react";
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Header from './components/header';
import Shows from './components/shows';
import View from './components/view';
import Favourite from './components/favourite';
import "./style.css";

function App() {
    return (
        <Router>
            <div>
                <Header />
                <Routes>
                    <Route path="/" element={<Outlet />}>
                        <Route index element={<Shows />} />
                        <Route path="/view/:id" element={<View />} />
                        <Route path="/favourite" element={<Favourite />} />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;