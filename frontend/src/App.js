import { useState } from "react";
import { Login } from "./Login";

import './App.css';
import Bicycle, {UpdateBicycle} from './Bicycle';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// my name is Delaney

// here is another comment by Delaney

// please give me a 100%

function App() {

  const [bikeInfo, setBikeInfo] = useState();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element= {<Login />} />
        <Route path="/" element={<Bicycle info={bikeInfo} setInfo={setBikeInfo}/>}/>
        <Route path="/update" element={<UpdateBicycle setInfo={setBikeInfo}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
