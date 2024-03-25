import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { InputLabel } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

function View() {
    const [viewData, setViewData] = useState({});
    const [selectedSeason, setSelectedSeason] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

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

    const handleBackButtonClick = () => {
        navigate("/");
    };

    const handleSeasonChange = (event) => {
        setSelectedSeason(event.target.value);
    };

    const handleAddToFavourites = (episode) => {
        const favourites = JSON.parse(localStorage.getItem('favourites')) || [];

        let seriesIndex = favourites.findIndex(favorite => favorite.title === viewData.title);

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
            let seasonIndex = favourites[seriesIndex].seasons.findIndex(season => season.title === selectedSeason);

            if (seasonIndex === -1) {
                favourites[seriesIndex].seasons.push({
                    title: selectedSeason,
                    episodes: [episode]
                });
            } else {
                favourites[seriesIndex].seasons[seasonIndex].episodes.push(episode);
            }
        }

        localStorage.setItem('favourites', JSON.stringify(favourites));
    };

    if (loading) return <h1>Loading...</h1>;

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
                    <h3>{viewData.genres && viewData.genres.join(', ')}</h3>
                </>
            )}
            <div className="view-dropdown-container">
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
            </div>
            {selectedSeason && viewData.seasons && (
                <div>
                    {viewData.seasons.find(season => season.title === selectedSeason)?.episodes.map((episode, index) => (
                        <div className="view-episode" >
                            <h3>Episode:</h3>
                            <h2>{episode.episode}</h2>
                            <h3>Title:</h3>
                            <h2>{episode.title}</h2>
                            <h3>Description:</h3>
                            <p>{episode.description}</p>
                            <audio className="view-audio" src={episode.file} controls />
                            <Box sx={{ margin: "20px"}}>
                                <Button className="view-favourite-button" variant="contained" color="secondary" onClick={() => handleAddToFavourites(episode)} >
                                    Add to Favourites
                                </Button>
                            </Box>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default View;