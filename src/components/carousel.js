import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Carousel = ({ interval = 6000 }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [dataShows, setShowsData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("https://podcast-api.netlify.app/shows");
                const data = await res.json();
                setShowsData(data);
            } catch (error) {
                console.error('Error fetching show data:', error);
            }
        };

        fetchData();

    }, []);

    const images = useMemo(() =>
        dataShows.map(item => item.image)
        , [dataShows]
    );

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

    const nextSlide = useCallback(() => {
        setActiveIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    }, [images]);

    const prevSlide = useCallback(() => {
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    }, [images]);


    useEffect(() => {
        const autoPlayInterval = setInterval(nextSlide, interval);
        return () => {
            clearInterval(autoPlayInterval);
        };
    }, [interval, nextSlide]);

    const handleCarouselClick = (id) => {
        navigate(`/view/${id}`)
    };

    return (
        <div>
            <button className="carousel-button carousel-button-prev" onClick={prevSlide}>
                <ArrowBackIcon />
            </button>
            <div className="carousel">
                <h2 className="carousel-interesed">You may be interested in...</h2>
                <div className="carousel-content" onClick={() => handleCarouselClick(dataShows[activeIndex]?.id)}>
                    <div>
                        <img src={images[activeIndex]} alt={`Slide ${activeIndex}`} className="carousel-img" />
                        <h1>{dataShows[activeIndex]?.title}</h1>
                        <h2 className="carousel-genre" >{dataShows[activeIndex]?.genres.map(genreId => GenreMapping[genreId]).join(', ')}</h2>
                        <h2>Seasons: {dataShows[activeIndex]?.seasons}</h2>
                    </div>
                </div>
            </div>
            <button className="carousel-button carousel-button-next" onClick={nextSlide}>
                <ArrowForwardIcon />
            </button>
        </div>
    );
};

export default Carousel;