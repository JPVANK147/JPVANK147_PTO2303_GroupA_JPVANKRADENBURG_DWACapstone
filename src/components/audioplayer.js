import React from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function AudioPlayer({ isOpen, onClose, viewData, episode }) {
    if (!isOpen) return null;

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

export default AudioPlayer;

