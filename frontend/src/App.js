import { useState } from "react";
import { Login } from "./Login";

import './App.css';
import Bicycle, {UpdateBicycle} from './Bicycle';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// app react component

//Here is another comment about my work

// please fix my code

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
