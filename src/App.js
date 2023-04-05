import { useState, useEffect } from "react";
import GoogleMap from "google-maps-react-markers";
import Marker from "./marker";
import mapOptions from "./map-options.json";

  const App = (() => {
    //state 
    const [reports, setReports] = useState([]);

    //Will be used for the pop-up effect
    //const [highlighted, setHighlighted] = useState(null);

    //fetch reports 
    const fetchReprots = () => {

      //API link that fetches disaster name, description, and status
      //Has filters that only diplay the 3 most recent disasters that include earthquakes, tsunamis, and flashfloods
       fetch('https://api.reliefweb.int/v1/disasters?appname=apidoc&preset=latest&limit=10&filter[field]=name&filter[value][]=earthquake&filter[value][]=tsunami&filter[value][]=flashflood&fields[include][]=url&fields[include][]=description&fields[include][]=status&fields[include][]=country.name&fields[include][]=primary_country.name')
       .then(result => result.json())
       
       .then((data) => {

        Promise.all(
          data.data.map((n) => 
          //Using the openCage Geocoding API to pass in a country name and get coordinates back
          fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(n.fields.primary_country.name)}&key=${process.env.REACT_APP_API_KEY}`)

          
          .then((result) => result.json())
          .then((data) => {

            //Recieves the results(if any) from the API
            const results = data.results;
            //This will use the data from the result to store the longitude and latitude if there is any results to pull from
            const geometry = results.length > 0 ? results[0].geometry : null;
            return{
              ...n,
              //Stores the latitude
              latitude: geometry ? geometry.lat : null,
              //Stores the longitude
              longitude: geometry ? geometry.lng : null,
            };
          })
          )
        ) .then((updatedData) => setReports(updatedData));


       })
      .catch(error => console.log(error))


    }


    useEffect (() => {
     fetchReprots()
    }, [])

    return(
      <div>

          {/* This holds the google map */}
          <div className="map-container">
            <GoogleMap
            defaultCenter={{ lat: 45.4046987, lng: 12.2472504 }}
            defaultZoom={5}
            options={mapOptions}
            mapMinHeight="600px"
            >
              {/* This will use the openCage API to mark the location of the disasters onto the map*/}
              {reports.map(({fields, latitude, longitude}, index) => (
                <Marker
                key={index}
                lat={latitude}
                lng={longitude}
                markerId={fields.name}
                className="marker"
                />

              ))}

            </GoogleMap>
          </div>

          {/* This creates a list of recent disasters below the google map */}
          <div className="disaster-container">
            <h2>Recent Disasters</h2>
            {reports.map((n, i) => (
              <div>
                <h3>{n.fields.name}</h3>
                <p>Status: {n.fields.status}</p>
                <p>Country: {n.fields.primary_country.name}</p>
              </div>
            ))}
          </div>


      </div>

    );
     

  });

  export default App;


