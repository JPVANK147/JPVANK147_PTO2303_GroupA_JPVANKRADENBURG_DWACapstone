import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AudioPlayer from "./audioplayer";
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { InputLabel } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

// A Function for the View component
function View() {
    // A State for view data
    const [viewData, setViewData] = useState({});

    // A State for selected season
    const [selectedSeason, setSelectedSeason] = useState("");

    // A State for loading status
    const [loading, setLoading] = useState(true);

    // A State for selected episode
    const [selectedEpisode, setSelectedEpisode] = useState(null);

    // A State for overlay open/close
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    // Hook for navigation
    const navigate = useNavigate();

    // Extracting id parameter from URL
    const { id } = useParams();

    // Fetch show data from API based on id on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`https://podcast-api.netlify.app/id/${id}`);
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await res.json();
                setViewData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching show data:', error);
                setLoading(false);
            }
        };

        fetchData();

    }, [id]);

    // Function to navigate back to home page, if audio is play or not
    const handleBackButtonClick = () => {
        if (selectedEpisode && isOverlayOpen) {
            const confirmationMessage = window.confirm("Audio is playing. Are you sure you want to go back?")
            if (confirmationMessage) {
                navigate("/")
            }
        } else {
            navigate("/");
        }
    };

    // Event handler for season change
    const handleSeasonChange = (event) => {
        setSelectedSeason(event.target.value);
    };

    // Function to add an episode to the favourites page
    const handleAddToFavourites = (episode) => {
        // Get the favourites from local storage or initialize as empty array
        const favourites = JSON.parse(localStorage.getItem('favourites')) || [];

        // Find the index of the series in favourites
        let seriesIndex = favourites.findIndex(favourite => favourite.title === viewData.title);

        // If series not found in favourites, add it
        if (seriesIndex === -1) {
            favourites.push({
                title: viewData.title,
                description: viewData.description,
                seasons: [{
                    title: selectedSeason,
                    episodes: [episode]
                }]
            });
        } else {
            // Find index of the season in series
            let seasonIndex = favourites[seriesIndex].seasons.findIndex(season => season.title === selectedSeason);

            // If season not found in series, add it
            if (seasonIndex === -1) {
                favourites[seriesIndex].seasons.push({
                    title: selectedSeason,
                    episodes: [episode]
                });
            } else {
                // Add episode to existing season
                favourites[seriesIndex].seasons[seasonIndex].episodes.push(episode);
            }
        }

        // Save favourites to local storage
        localStorage.setItem('favourites', JSON.stringify(favourites));
    };

    // Event handler for clicking on audio player button
    const handleAudioPlayerClickButton = (episode) => {
        setSelectedEpisode(episode);
        setIsOverlayOpen(true);
    };

    // If the data is still loading, show loading ring
    if (loading) return (
        <div className="loader-ring"></div>
    );

    // Rendering the View component
    return (
        <div className="view-border">
            <Button className="view-back-button" variant="contained" color="secondary" onClick={handleBackButtonClick}>
                Back
            </Button>
            {viewData && (
                <>
                    <img className="view-img" src={viewData.image} alt="podcast-cover" />
                    <h1>{viewData.title}</h1>
                    <h3>{viewData.description}</h3>
                    <h3 className="carousel-genre">{viewData.genres && viewData.genres.join(', ')}</h3>
                </>
            )}
            <div>
                <Box sx={{ minWidth: 320, margin: "20px", }}>
                    <FormControl fullWidth>
                        <InputLabel id="season">Season:</InputLabel>
                        <Select
                            labelId="season"
                            id="season"
                            label="Season"
                            color="secondary"
                            value={selectedSeason}
                            onChange={handleSeasonChange}
                        >
                            <MenuItem value="select-season">Select a Season</MenuItem>
                            {viewData.seasons && viewData.seasons.map((season, index) => (
                                <MenuItem key={index} value={season.title}>
                                    {season.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </div>
            {selectedSeason && viewData.seasons && (
                <div>
                    {viewData.seasons.find(season => season.title === selectedSeason)?.episodes.map((episode) => (
                        <div className="view-episode">
                            <h3>Episode:</h3>
                            <h2>{episode.episode}</h2>
                            <h3>Title:</h3>
                            <h2>{episode.title}</h2>
                            <h3>Description:</h3>
                            <p>{episode.description}</p>
                            <Box>
                                <Button variant="contained" color="secondary" onClick={() => handleAudioPlayerClickButton(episode)}>
                                    Audioplayer
                                </Button>
                            </Box>
                            <Box sx={{ margin: "15px" }}>
                                <Button variant="contained" color="secondary" onClick={() => handleAddToFavourites(episode)} >
                                    Add to Favourites
                                </Button>
                            </Box>
                        </div>
                    ))}
                </div>
            )}
            <AudioPlayer isOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(false)} viewData={viewData} episode={selectedEpisode} />
        </div>
    );
}

// Exporting the View component to be used elsewhere
export default View;