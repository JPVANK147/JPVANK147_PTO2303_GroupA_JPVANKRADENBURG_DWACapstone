import React from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

// Function component named AudioPlayer which takes props as input
function AudioPlayer({ isOpen, onClose, viewData, episode }) {
    
    // If isOpen prop is false, return null meaning don't render anything
    if (!isOpen) return null;

    // If isOpen is true, render the following
    return (
        <div className="overlay">
            <div className="overlay__background" />
            <div className="overlay__container">
                <div className="overlay__controls">
                </div>
                <div>
                    <h2>Title: {viewData.title}</h2>
                    <h3>Episode: {episode.episode}</h3>
                    <h3>Title of Episode: {episode.title}</h3>
                    <audio className="view-audio" src={episode.file} controls />
                    <Box sx={{ margin: "20px" }}>
                        <Button variant="contained" color="secondary" onClick={onClose}>
                            Close
                        </Button>
                    </Box>
                </div>
            </div>
        </div>
    );
}

// Exporting the AudioPlayer component to be used elsewhere
export default AudioPlayer;