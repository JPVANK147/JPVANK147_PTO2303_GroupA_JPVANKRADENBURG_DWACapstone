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

function Shows() {
    const [searchTitle, setSearchTitle] = useState("");
    const [searchGenre, setSearchGenre] = useState("");
    const [sortingOption, setSortingOption] = useState("");
    const [showsData, setShowData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("https://podcast-api.netlify.app/shows");
                const data = await res.json();
                setShowData(data);
            } catch (error) {
                console.error('Error fetching show data:', error);
            }
        };

        fetchData();

    }, []);

    const filteredData = showsData.filter(show =>
        show.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
        (searchGenre === "" || show.genres.includes(parseInt(searchGenre)))
    );

    const handleSearchTitleChange = (event) => {
        setSearchTitle(event.target.value);
    };

    const handleSearchGenreChange = (event) => {
        setSearchGenre(event.target.value);
    };

    const handleSortingChange = (event) => {
        setSortingOption(event.target.value);
    };

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

    const handleShowSorting = () => {
        let sortedData = filteredData;
        if (sortingOption) {
            sortedData = sortShows(sortedData, sortingOption);
        }
        return sortedData;
    };


    const handleViewClick = (id) => {
        navigate(`/view/${id}`)
    };

    const listOfShows = handleShowSorting().map((dataShow, index) => {
        const genreMap = dataShow.genres.map(genreId => GenreMapping[genreId]).join(', ');

        const updateDate = () => {
            return new Date(dataShow.updated).toISOString().split('T')[0];
        };

        const updateTime = () => {
            return new Date(dataShow.updated).toISOString().slice(11, 19);
        };

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

export default Shows;

/*
<div className="grid-container">
                <div key={index} className="show-border">
                    <img className="show-image" src={dataShow.image} alt="show-img" />
                    <div>
                        <h3>Title: {dataShow.title}</h3>
                        <h3>Description: {`${dataShow.description.substring(0, 250)}...`}</h3>
                        <h3>Seasons: {dataShow.seasons}</h3>
                        <h3>Genres: {genreMap}</h3>
                        <h3>Updated: {updateDate(dataShow.updated)}</h3>
                        <h3>Time: {updateTime(dataShow.updated)}</h3>
                    </div>
                    <Button className="show-view-button" variant="contained" color="secondary" onClick={() => handleViewClick(dataShow.id)}>
                        View
                    </Button>
                </div>
            </div>
            */