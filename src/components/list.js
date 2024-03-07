import React from "react";
/*
const Preview = {
    image: data.,
    title: "",
    decription: "",
    season: "",
    update: "",
}
*/
function List() {

    const [showData, setshowData] = React.useState({})

    React.useEffect(() => {
        fetch("https://podcast-api.netlify.app/shows")
            .then(res => res.json())
            .then(data => setshowData(data[0]));
    }, [])

    /*
    const showpreview = new Array(50)
        .fill(undefined)
        .map(() => ({
            image: "",
            title: "",
            decription: "",
            season: "",
            update: "",
        }))


    showpreview.map({ image, title, decription, season, update }) => (

    )
    */
    const updateDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    return (
        <div className="list-border">
            <img className="list-image" src={showData.image} alt="list" />
            <div className="info">
                <h3>Title: {showData.title}</h3>
                <p>Decription: {showData.description}</p>
                <h3>Seasons: {showData.seasons}</h3>
                <h3>Update: {updateDate(showData.updated)}</h3>
            </div>
        </div>
    );
}

export default List

/*
import React from "react";

function List({ showData }) {
    const updateDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    return (
        <div>
            {showData.map((dataItem, index) => (
                <div key={index} className="list-border">
                    <img className="list-image" src={dataItem.image} alt="list" />
                    <div className="info">
                        <h3>Title: {dataItem.title}</h3>
                        <p>Description: {dataItem.description}</p>
                        <h3>Seasons: {dataItem.seasons}</h3>
                        <h3>Update: {updateDate(dataItem.updated)}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default List;
*/