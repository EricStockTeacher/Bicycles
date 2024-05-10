import NavBar from "./Navigation.js";
import { useRef } from "react";
import { useEffect, useState } from "react";
import {Navigate} from 'react-router-dom';

function Bicycle(props) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshData, setRefreshData] = useState(false);

    const handleDelete = evt => {
        console.log(evt.target.id);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer "+localStorage.getItem('token'));

        const raw = JSON.stringify({
            "name": evt.target.id
        });

        const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
        };

        fetch("/api/bicycle", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            console.log(result)
            //props.setInfo(props.info.filter( (bike) => bike.name != evt.target.id));
            setRefreshData(!refreshData);
        })
        .catch((error) => console.error(error));
    }

    useEffect( () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+localStorage.getItem('token'));

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
        .then( bike => {
            props.setInfo(bike);
            setLoading(false); 
        })
        .catch( e => {
            console.log("Error!!!");
            console.log(e.message);
            setError(e.message);
        });
        
      },[refreshData])
    console.log(props.info);
    

    if(error) return (
        <>
        <NavBar/>
        <p>Error: {error}</p>
        <Navigate to="/login" replace={true} />
        </>
    )
    if(loading) return (
        <>
        <NavBar/>
        <p>Loading...</p>
        </>
    )

    /*const token = localStorage.getItem("token");

    if( !token) {
        return (<Navigate to="/login" replace={true} />)
    }*/
    
    
    return (
        <>
            <NavBar/>
            {
                props.info.map( bike => {
                    return (
                    <>
                    <h2>Name: {bike.name}</h2>
                    <h3>Color: {bike.color}</h3>
                    <img src = {"images/"+bike.image}></img>
                    <button onClick={handleDelete} id={bike.name} >Delete</button>
                    </>)
                })
            }  
        </>
    )
}

export function UpdateBicycle(props) {
    const nameText = useRef();
    const colorText = useRef();
    const imageText = useRef();
    
    const submit = (e) => {
        e.preventDefault();
        
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer "+localStorage.getItem('token'));

        var raw = JSON.stringify({
            "name": nameText.current.value,
            "color": colorText.current.value,
            "image": imageText.current.value
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("/api/bicycle", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            nameText.current.value = "";
            colorText.current.value = "";
            imageText.current.value = "";
        })
        .catch((error) => console.error(error));
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