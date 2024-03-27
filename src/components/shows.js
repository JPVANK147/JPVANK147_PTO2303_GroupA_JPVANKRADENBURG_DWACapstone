import React, { useState, useEffect } from "react";
import Carousel from "./carousel";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { InputLabel } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

// Mapping of genre IDs to their names
const GenreMapping = {
    0: "All",
    1: "Personal Growth",
    2: "True Crime and Investigative Journalism",
    3: "History",
    4: "Comedy",
    5: "Entertainment",
    6: "Business",
    7: "Fiction",
    8: "News",
    9: "Kids and Family"
};

// A Function for the Shows component
function Shows() {
    // A State for loading status
    const [loading, setLoading] = useState(true);

    // A State for the search title
    const [searchTitle, setSearchTitle] = useState("");

    // A State for the search genre
    const [searchGenre, setSearchGenre] = useState("");

    // A State for the sorting option
    const [sortingOption, setSortingOption] = useState("");

    // A State for the show data
    const [showsData, setShowData] = useState([]);

    // Hook for navigation
    const navigate = useNavigate();

    // Fetch the show data from API onto a component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("https://podcast-api.netlify.app/shows");
                const data = await res.json();
                setShowData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching show data:', error);
                setLoading(false);
            }
        };

        fetchData();

    }, []);

    // Filter shows based on search title and genre
    const filteredData = showsData.filter(show =>
        show.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
        (searchGenre === "" || show.genres.includes(parseInt(searchGenre)))
    );

    // Event handler for search title change
    const handleSearchTitleChange = (event) => {
        setSearchTitle(event.target.value);
    };

    // Event handler for search genre change
    const handleSearchGenreChange = (event) => {
        setSearchGenre(event.target.value);
    };

    // Event handler for sorting change
    const handleSortingChange = (event) => {
        setSortingOption(event.target.value);
    };

    // Function to sort shows based on sorting option
    const sortShows = (data, option) => {
        switch (option) {
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

    // Function to handle sorting of shows
    const handleShowSorting = () => {
        let sortedData = filteredData;
        if (sortingOption) {
            sortedData = sortShows(sortedData, sortingOption);
        }
        return sortedData;
    };

    // Event handler for clicking on a show to view the shows details
    const handleViewClick = (id) => {
        navigate(`/view/${id}`)
    };

    if (loading) return (
        <div className="loader-ring"></div>
    );


    // Rendering the list of shows
    const listOfShows = handleShowSorting().map((dataShow, index) => {
        // Map genre IDs to their corresponding names
        const genreMap = dataShow.genres.map(genreId => GenreMapping[genreId]).join(', ');

        // Function to format update date
        const updateDate = () => {
            return new Date(dataShow.updated).toISOString().split('T')[0];
        };

        // Function to format update time
        const updateTime = () => {
            return new Date(dataShow.updated).toISOString().slice(11, 19);
        };

        // Rendering each individual show
        return (
            <div key={index} className="show-grid-container">
                <div className="show-border">
                    <div>
                        <img className="show-image" src={dataShow.image} alt="show-img" />
                        <h3>Title: {dataShow.title}</h3>
                        <h3>Description: {`${dataShow.description.substring(0, 75)}..`}</h3>
                        <h3>Seasons: {dataShow.seasons}</h3>
                        <h3>Genres: {genreMap}</h3>
                        <h3>Updated: {updateDate(dataShow.updated)}</h3>
                        <h3>Time: {updateTime(dataShow.updated)}</h3>
                        <Button className="show-view-button" variant="contained" color="secondary" onClick={() => handleViewClick(dataShow.id)}>
                            View
                        </Button>
                    </div>
                </div>
            </div>
        );
    });

    // Rendering the Shows component
    return (
        <div>
            <Carousel />
            <div className="search-show-container">
                <div>
                    <TextField id="standard-basic" label="TITLE" variant="standard" color="secondary" onChange={handleSearchTitleChange} />
                </div>
                <div>
                    <Box sx={{ minWidth: 320 }}>
                        <FormControl fullWidth>
                            <InputLabel id="genre">Genre:</InputLabel>
                            <Select
                                labelId="genre"
                                id="genre"
                                label="Genre"
                                color="secondary"
                                value={searchGenre}
                                onChange={handleSearchGenreChange}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                {Object.entries(GenreMapping).map(([id, genre]) => (
                                    <MenuItem key={id} value={id}>
                                        {genre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </div>
                <div>
                    <Box sx={{ minWidth: 250 }}>
                        <FormControl fullWidth>
                            <InputLabel id="sorting">Sorting:</InputLabel>
                            <Select
                                labelId="sorting"
                                id="sorting"
                                label="Sorting"
                                color="secondary"
                                value={sortingOption}
                                onChange={handleSortingChange}
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
            </div>
            <div className="show-grid-wrapper">
                {listOfShows}
            </div>
        </div>
    );
}

// Exporting the Shows component to be used elsewhere
export default Shows;