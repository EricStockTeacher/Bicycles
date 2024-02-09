import NavBar from "./Navigation.js";
import { useRef } from "react";
import { useEffect } from "react";

function Bicycle(props) {
    
    useEffect( () => {
        var myHeaders = new Headers();
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("/api/bicycle", requestOptions)
        .then(
            response =>  {
                if( !response.ok) {
                    let code = response.status.toString();
                    throw new Error( `${code} ${response.statusText}`);
                }
                return response.json();
        })
        .then( bike => props.setInfo(bike) )
        .catch( e => {
            console.log("Error!!!");
            console.log(e.message);
        });
        
      },[])

    return (
        <>
            <NavBar/>
            <h2>{props.info.name}</h2>
            <h3>{props.info.color}</h3>
            <img src = {"images/"+props.info.image}></img>
        </>
    )
}

export function UpdateBicycle(props) {
    const nameText = useRef();
    const colorText = useRef();
    const imageText = useRef();
    
    const submit = (e) => {
        //e.preventDefault();
        //props.setInfo( {name: nameText.current.value, color: colorText.current.value, image: imageText.current.value});
    }
    
    return (
        <>
        <NavBar/>
        <h2>Update Bicycle</h2>
        <form action ='/api/updateBicycle' method="post"  onSubmit={ submit }  >
            <input 
                type="text"
                name ="name"
                ref={ nameText }
                placeholder="enter name..."/>
            <input
                type="text"
                name="color"
                ref={colorText}
                placeholder="enter color..."/>
            <input
                type="text"
                name="image"
                ref={imageText}
                placeholder="enter image..."/>
            <button>Update</button>
        </form>
        </>
    )
}

export default Bicycle;