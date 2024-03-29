import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { InputLabel } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

// A Function of the Favourite component
function Favourite() {
    // Hook for navigation
    const navigate = useNavigate();

    // A State for the favourites
    const [favourites, setFavourites] = useState([]);

    // A State for tracking if audio is playing or paused
    const [isPlaying, setIsPlaying] = useState(false);

    // A State for loading status
    const [loading, setLoading] = useState(true);

    // Reference to the audio element
    const audioRef = React.createRef();

    // Fetch stored favourites from local storage
    useEffect(() => {
        setTimeout(() => {
            const storedFavourites = JSON.parse(localStorage.getItem('favourites')) || [];
            setFavourites(storedFavourites);
            setLoading(false);
        }, 1000);
    }, []);

    // Event handler to navigate back to home page
    const handleGoBackToHomeClick = () => {
        navigate("/")
    };

    // If the data is still loading, show loading ring
    if (loading) return (
        <div className="loader-ring"></div>
    );

    // Function to toggle play or pause
    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }

        setIsPlaying(!isPlaying);
    };

    // Function to handle sorting favourites
    const handleSortingFavouriteChange = (event) => {
        const selectedSortOption = event.target.value;
        const sortedFavourites = sortFavourites([...favourites], selectedSortOption);
        setFavourites(sortedFavourites);
    };

    // Function to handle searching for favourite titles
    const handleSearchFavouriteTitleChange = (event) => {

        // Search query from the input field and convert it to lowercase
        const search = event.target.value.toLowerCase();

        // If the search query is empty, reset favourites to the stored favourites in local storage
        if (search === "") {
            const storedFavourites = JSON.parse(localStorage.getItem('favourites')) || [];
            setFavourites(storedFavourites);
        } else {
            // If the search query is not empty, filter favourites based on whether the title or any episode title contains the search query
            const filteredFavourites = favourites.filter((favourite) =>
                favourite.title.toLowerCase().includes(search) ||
                favourite.seasons.some((season) =>
                    season.episodes.some((episode) =>
                        episode.title.toLowerCase().includes(search)
                    )
                )
            );
            // Update the favourites with the filtered results
            setFavourites(filteredFavourites);
        }
    };

    // Function to handle unfavouriting an episode
    const handleUnfavouriteClick = (favouriteIndex, seasonIndex, episodeIndex) => {
        // Create a copy of the favourites array
        const updatedFavourites = [...favourites];

        // Get the favourite object based on the index
        const favourite = updatedFavourites[favouriteIndex];

        // Get the season object from the favourite
        const season = favourite.seasons[seasonIndex];

        // Remove the episode from the season
        season.episodes.splice(episodeIndex, 1);

        // If the season has no more episodes, remove the season from the favourite
        if (season.episodes.length === 0) {
            favourite.seasons.splice(seasonIndex, 1);
        };

        // If the favourite has no more seasons, remove the favourite from the updatedFavourites array
        if (favourite.seasons.length === 0) {
            updatedFavourites.splice(favouriteIndex, 1);
        };

        // Update the state with the updated favourites array
        setFavourites(updatedFavourites);

        // Update the local storage with the updated favourites array
        localStorage.setItem('favourites', JSON.stringify(updatedFavourites));
    };

    // Function to format current date
    const formattedDate = () => {
        const currentDate = new Date();
        const day = currentDate.getDate();
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];

        const month = monthNames[currentDate.getMonth()];
        const year = currentDate.getFullYear();
        return `${day} ${month} ${year}`
    };

    // Function to sort favourites based on selected option
    const sortFavourites = (data, sortBy) => {
        switch (sortBy) {
            case "From A to Z":
                return data.sort((a, b) => a.title.localeCompare(b.title));
            case "From Z to A":
                return data.sort((a, b) => b.title.localeCompare(a.title));
            case "Ascendend Order":
                return data.sort((a, b) => new Date(a.updated) - new Date(b.updated));
            case "Descendend Order":
                return data.sort((a, b) => new Date(b.updated) - new Date(a.updated));
            default:
                return data;
        }
    };

    // Rendering the Favourite component
    return (
        <div>
            <div className="favourite-container-page">
                <div>
                    <TextField id="standard-basic" label="Search Title" variant="standard" color="secondary" onChange={handleSearchFavouriteTitleChange} />
                </div>
                <div className="favourite-sorting-container">
                    <Box sx={{ minWidth: 250 }}>
                        <FormControl fullWidth>
                            <InputLabel id="favourites">Favourites:</InputLabel>
                            <Select
                                labelId="favourites"
                                id="favourites"
                                label="favourites"
                                color="secondary"
                                value={""}
                                onChange={handleSortingFavouriteChange}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="From A to Z">From A to Z</MenuItem>
                                <MenuItem value="From Z to A">From Z to A</MenuItem>
                                <MenuItem value="Ascendend Order">Ascendend Order</MenuItem>
                                <MenuItem value="Descendend Order">Descendend Order</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </div>
                <div className="back-to-shows">
                    <Button variant="contained" color="secondary" onClick={handleGoBackToHomeClick}>
                        Back to Shows
                    </Button>
                </div>
            </div>
            <div className="view-favourite-episode">
                {favourites.map((favourite, index) => (
                    <div key={index}>
                        <h1>{favourite.title}</h1>
                        <h3>Description: {favourite.description}</h3>
                        {favourite.seasons && favourite.seasons.map((season, seasonIndex) => (
                            <div key={seasonIndex}>
                                <h2>{season.title}</h2>
                                {season.episodes && season.episodes.map((episode, episodeIndex) => (
                                    <div key={episodeIndex}>
                                        <h2>Episode Title: {episode.title}</h2>
                                        <h4>Episode Description: {episode.description}</h4>
                                        <h3>Episode Number: {episode.episode}</h3>
                                        <h3>Add to Favourite: {formattedDate()}</h3>
                                        <div>
                                            <audio ref={audioRef} src={episode.file} />
                                            <Button sx={{ bottom: "5px" }} variant="contained" color="secondary" onClick={togglePlay}>
                                                {isPlaying ? 'Pause' : 'Play'}
                                            </Button>
                                        </div>
                                        <div>
                                            <Button sx={{ top: "2.5px" }} variant="contained" color="secondary" onClick={() => handleUnfavouriteClick(index, seasonIndex, episodeIndex)}>
                                                Unfavourite
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Favourite;