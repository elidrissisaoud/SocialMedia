import { Link, useNavigate } from "react-router-dom";
import Navbarre from "./navbarre";
import { useEffect, useState } from "react";

export default function Compte(){
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [message, setMessage] = useState('')
    const user = JSON.parse(localStorage.getItem('user'))
    const token = localStorage.getItem('token')
    useEffect(()=>{
        fetch("http://localhost:8000/api/userposts/"+user.id, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
          })
          .then((response)=>response.json())
          .then((data)=>setPosts(data))
    },[])
    //const post = user.posts;
    function deleteHandler(p){
        fetch(`http://localhost:8000/api/post/+${p.id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
          })
          .then((response)=>response.json())
          .then((data)=>setMessage(data))
    }
    if (message) {
        window.location.reload()
    }
    if (localStorage.getItem('token')) {
        return(
            <div align="center">
                <Navbarre/>
                <div className="card mb-3 profile">
                <div className="row g-0">
                    <div className="col-md-4">
                    <img src={"http://localhost:8000/"+user.image} className="img-fluid rounded-circle" alt="your acount image" style={{ width: '200px',height:'200px' }}/>
                    </div>
                    <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{user.name}</h5>
                        <p className="card-text">{user.email}</p>
                        <p className="card-text"><small className="text-body-secondary">{new Date(user.created_at).toLocaleDateString()}</small></p>
                    </div>
                    </div>
                </div>
                </div>
                {posts.map((post)=>{

                        return(
                        <div className="card my-4 post" key={post.id}>
                                <img src={"http://localhost:8000/"+post.image} className="card-img-bottom" alt="post"/>
                            <div className="card-body">
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">{post.description}</p>
                            </div>
                            <button className="btn btn-danger" onClick={()=>deleteHandler(post)}>delete</button>
                            <Link to={`/update/${post.id}`}>update</Link>
                        </div>
                        )
                })}
                
            </div>
        );   
    }
    else{
        navigate('/login')
    }
}