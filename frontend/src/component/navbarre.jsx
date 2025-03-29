import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
export default function Navbarre(){
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    function logoutHandel(e){
        e.preventDefault()
        fetch("http://localhost:8000/api/logout", {
            method: "POST",
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }).then((response) => {
            if (response.status === 200) {
                return response.json();
            }
            else {
                return response.json().then(err => {
                    throw err;
                });
            }})
            .then((data)=>{
                localStorage.removeItem('token')
                console.log(data.message)
                navigate('/login')
            }).catch((error)=>{
                console.log(error)
            })
    }
    return(
        <nav className="navbar navbar-expand-lg bg-body" align="start">
            <div className="container-fluid bg-transparent">
                <Link className="navbar-brand" to={'/compte'}>My Acount</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <Link className="nav-link active" aria-current="page" to={'/postes'}>Posts</Link>
                    <Link className="nav-link" to={'/add'}>Add post</Link>
                    <form onSubmit={(e)=>logoutHandel(e)}>
                        <button type="submit"  className="nav-link">
                            Log out
                        </button>
                    </form>
                </div>
                </div>
            </div>
        </nav>
    );
}