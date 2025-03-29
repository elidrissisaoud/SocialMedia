import { useEffect, useState } from "react";
import Navbarre from "./navbarre";
import { useNavigate } from "react-router-dom";

export default function Posts(){
    const [postes, setPostes] = useState([])
    const [image, setImage] = useState([])
    const [text, setText] = useState("")
    const [message, setMessage] = useState("")
    const user = JSON.parse(localStorage.getItem('user'))
    const token = localStorage.getItem('token')
    const [thereIs, setTherIs] = useState(false)
    
    useEffect(()=>{
        fetch("http://localhost:8000/api/user", {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
          })
          .then((response)=>response.json())
          .then((data)=>setImage(data))
        },[])
    
    function findImageByUserId(id){
            let find = image.filter((e)=>e.id === id)
            return find[0].image
    }

    useEffect(()=>{
        fetch("http://localhost:8000/api/post", {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
              },
          })
          .then((response)=>response.json())
          .then((data)=>setPostes(data))
    },[])
    const navigate = useNavigate()
    function submitHandeler(e,id) {

        e.preventDefault();
        const formData = new FormData();
        formData.append("text", text);
        formData.append("post_id", id);
        formData.append("user_id",user.id)

        fetch("http://localhost:8000/api/reaction", {
            method: "POST",
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            }
            else {
                return response.json().then(err => {
                    throw err;
                });
            }
        }).then((data) => {
            setMessage(data.message)
        })
        .catch((error) => {
            if (error.errors) {
                console.log(error.errors);
            } 
            else {
                console.error('An error occurred:', error);
            }
        });
        
    }
    if (message) {
        window.location.reload()
    }
    if (localStorage.getItem('token')) {
    return(
        <div align="center">
            <Navbarre/>
            {postes.map((poste)=>{
                return(
                    <div className="card my-4 post" key={poste.id} align="start">
                        <div className="toast-header my-4">
                            <img src={"http://localhost:8000/"+poste.user.image} className="mx-3 account-image" style={{ width: '60px',height:'60px' }}/>
                            <strong className="me-auto">{poste.user.name}</strong>
                            {poste.updated_at === poste.created_at?<strong className="me-auto">{new Date(poste.created_at).toLocaleDateString()}</strong>:<strong className="me-auto">{new Date(poste.updated_at).toLocaleDateString()}(upd)</strong>}
                        </div>
                        <img src={"http://localhost:8000/"+poste.image} className="card-img-bottom" alt="post"/>
                        <div className="card-body">
                            <h5 className="card-title">{poste.title}</h5>
                            <p className="card-text">{poste.description}</p>
                        </div>
                        <div className="d-flex justify-content-between">
                        <div className="dropstart">
                            <button className="btn btn-success" type="button" data-bs-toggle={poste.reactions.lenght!==0?"dropdown":""} aria-expanded="false">
                                Comments
                            </button>
                                <ul className="dropdown-menu scroll-list" align="center">
                                <button type="button" className="btn-close"></button>
                                {
                                poste.reactions.map((reaction)=>{
                                            return(
                                                <li key={reaction.id} className="dropdown-item my-4">
                                                    <div className="toast-header text-center">
                                                        <img src={"http://localhost:8000/"+findImageByUserId(reaction.user_id)} className="rounded-circle mx-3" style={{ width: '60px',height:'60px' }}/>
                                                        <strong className="me-auto mx-3">{}</strong>
                                                        <p>{reaction.text}</p>
                                                    </div>
                                                </li>
                                            );
                                    }
                                )
                                }
                                {poste.reaction == null && <li>No comments</li>}
                                
                                </ul>
                        </div>
                        <div className="btn-group dropend">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    Commenter
                                </button>
                                <ul className="dropdown-menu">
                                    <form className="form" onSubmit={(e,id)=>submitHandeler(e,poste.id)} align="center">
                                        <textarea className="form-control" value={text} onChange={(e)=>setText(e.target.value)} rows="3"></textarea>
                                        <button className="btn btn-warning">Envoyer</button>
                                    </form>
                                </ul>
                        </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
    }else{
        useEffect(()=>{
            navigate('/login')
        },[])
    }
}