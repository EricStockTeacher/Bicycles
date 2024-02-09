import {Link} from "react-router-dom";

function NavBar() {
    return (
        <>
          <nav>
            <Link to="/">Home</Link> 
            <Link to="/update">Update</Link>   
        </nav>  
        </>
    )
}

export default NavBar;