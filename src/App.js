 import { useState, useEffect } from "react";


  const App = (() => {
    //state 
    const [reports, setReports] = useState([])

    //fetch reports 
    const fetchReprots = () => {

      // api link that fetches disaster name, description, and status
      // has filters that only diplay the 3 most recent disasters that include earthquakes, tsunamis, and flashfloods
       fetch('https://api.reliefweb.int/v1/disasters?appname=apidoc&preset=latest&limit=3&filter[field]=name&filter[value][]=earthquake&filter[value][]=tsunami&filter[value][]=flashflood&fields[include][]=url&fields[include][]=description&fields[include][]=status')
       .then(result => result.json())
       .then(data => setReports(data.data))
       .catch(error => console.log(error))


    }


    useEffect (() => {
     fetchReprots()
    }, [])

    return(
     <div>
     {reports.map((n, i) => (
       <div key={i}>
        
         <h3>                          {/* holds disaster name and link to disaster information*/} 
          <a href={n.fields.url}>      
          {n.fields.name}
          </a>
          </h3> 
        
        <p>{n.fields.description}</p> {/* holds disaster description*/} 
        <p>{n.fields.status}</p>      {/* holds disaster status*/} 
         {console.log(n.fields)}      {/* populates the console with the fields of datat that the api gives*/} 



       </div>
     ))}
       </div>
    );

  });

  export default App;


