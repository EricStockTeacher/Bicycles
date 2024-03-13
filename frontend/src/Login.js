export function Login() {
    const onButtonClicked = async () => {

        const requestOptions = {
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
    }


    return <button onClick={onButtonClicked}>Login</button>
}