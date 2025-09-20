import React, {useState, useEffect} from 'react';
import axios from 'axios';
import AllInsurancesDisplay from '../AllInsurancesDisplay/AllInsurancesDisplay';


const URL ="http://localhost:5000/insurances";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data.insurances);
}
function InsurancesAll() {

   const [insurances, setinsurances] = useState();
   useEffect(() => {
     fetchHandler().then((data) => setinsurances(data));
   },[])

   
  return (
    <div>
       <h1 className="text-4xl font-bold text-blue-900">  All Insurances</h1>
      <div>
       {insurances && insurances.map((user, i) => (
          <div key={i}>
            <AllInsurancesDisplay user={user} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default InsurancesAll;
