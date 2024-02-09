import NavBar from "./Navigation.js";
import { useRef } from "react";


function Bicycle(props) {
    
    const submit = (e) => {
        e.preventDefault(); 
        props.info.name = "Blue Bike"; 
        props.setInfo({ name: "Bike", color: "Yellow", image: "YellowBike.png"}); 
        console.log(props.info);
    }
    
    return (
        <>
            <NavBar/>
            <h2>{props.info.name}</h2>
            <h3>{props.info.color}</h3>
            <img src = {"images/"+props.info.image}></img>
            <form onSubmit={submit}>
              <button>Change</button>  
            </form>
        </>
    )
}



export function UpdateBicycle(props) {
    const nameText = useRef();
    const colorText = useRef();
    const imageText = useRef();
    
    const submit = (e) => {
        e.preventDefault();
        props.setInfo( {name: nameText.current.value, color: colorText.current.value, image: imageText.current.value});
    }
    
    return (
        <>
        <NavBar/>
        <h2>Update Bicycle</h2>
        <form onSubmit={ submit }  >
            <input 
                type="text"
                ref={ nameText }
                placeholder="enter name..."/>
            <input
                type="text"
                ref={colorText}
                placeholder="enter color..."/>
            <input
                type="text"
                ref={imageText}
                placeholder="enter image..."/>
            <button>Update</button>
        </form>
        </>
    )
}

export default Bicycle;