import { useState } from "react";

import './App.css';
import Bicycle, {UpdateBicycle} from './Bicycle';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  const [bikeInfo, setBikeInfo] = useState([{ name: "Red Bike", color: "Red", image: "RedBike.png"}]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Bicycle info={bikeInfo} setInfo={setBikeInfo}/>}/>
        <Route path="/update" element={<UpdateBicycle setInfo={setBikeInfo}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
