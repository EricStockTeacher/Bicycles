import {useState, useEffect} from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [ googleOauthUrl, setGoogleOauthUrl] = useState('');

    let navigate = useNavigate();

    useEffect( () => {
        const token = searchParams.get('token');
        if( token ) {
            localStorage.setItem("token", token);
            navigate('/');
        }

    }, [])

    useEffect( () => {
        fetch("/api/google/url")
        .then( response => response.json())
        .then( data => setGoogleOauthUrl(data.url))
        .catch( e => {
            console.log("Error");
            console.log(e.message);
            localStorage.clear();
        })
    })




    const onButtonClicked = () => {
        window.location.href = googleOauthUrl;
        /*const requestOptions = {
            method: "GET",
            redirect: "follow"
          };
          
          fetch("/api/login", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                localStorage.setItem("token", result.token);
            })
            .catch((error) => console.error(error));
            */
    }


    return <button disabled = {!googleOauthUrl} onClick={onButtonClicked}>Login</button>
}