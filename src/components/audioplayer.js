import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

// Function component named AudioPlayer
function AudioPlayer({ isOpen, onClose, viewData, episode }) {
    // A State for tracking if audio is playing or paused
    const [isPlaying, setIsPlaying] = useState(false);

    // A State for tracking current playback time
    const [currentTime, setCurrentTime] = useState(0);

    // A State for tracking audio duration
    const [duration, setDuration] = useState(0);

    // Reference to the audio element
    const audioRef = React.createRef();

    // Effect hook to handle setting up event listeners and remove event listeners
    useEffect(() => {
        const audio = audioRef.current;

        // Ensure audio element is available
        if (!audio) return;

        // Event handler for updating current time during playback
        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        // Event handler for updating duration on metadata load
        const handleLoadeddata = () => {
            setDuration(audio.duration);
        };

        // Add event listeners
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadeddata', handleLoadeddata);

        // Remove event listeners
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadeddata', handleLoadeddata);
        };

    }, [audioRef]);

    // Function to toggle play or pause
    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }

        setIsPlaying(!isPlaying);
    };

    // Function to handle slider change
    const handleSliderChange = (event) => {
        const newTime = event.target.value;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    // Function to format time in minutes and seconds
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Function to reset audio to the beginning
    const resetAudio = () => {
        audioRef.current.currentTime = 0;
        setCurrentTime(0)

        if (isPlaying) {
            audioRef.current.play()
        }
    };

    // Event handler to close the audioplayer, if the Audio is playing or not
    const handleCloseButton = () => {
        if (isPlaying) {
            const confirmationMessage = window.confirm("Audio is playing. Do you still want to go back?");
            if (confirmationMessage) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    // If isOpen is false, return null meaning don't render anything
    if (!isOpen) return null;

    // If isOpen is true, render the following
    return (
        <div className="audio-overlay">
            <div className="audio-overlay-container">
                <div className="audio-overlay-controls"></div>
                <div>
                    <h3>Title: {viewData.title}</h3>
                    <h3>Episode: {episode.episode}</h3>
                    <h3>Title of Episode: {episode.title}</h3>
                    <div className="audio-player">
                        <audio ref={audioRef} src={episode.file} />
                        <Button className="audio-play-button" variant="contained" color="secondary" onClick={togglePlay}>
                            {isPlaying ? 'Pause' : 'Play'}
                        </Button>
                        <Button className="audio-reset-button" variant="contained" color="secondary" onClick={resetAudio}>
                            Reset
                        </Button>
                        <input className="audio-slider"
                            type="range"
                            value={currentTime}
                            min={0}
                            max={duration}
                            onChange={handleSliderChange}
                        />
                        <span className="audio-time">{`${formatTime(currentTime)} / ${formatTime(duration)}`}</span>
                    </div>
                    <Box sx={{ margin: "20px" }}>
                        <Button variant="contained" color="secondary" onClick={handleCloseButton}>
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