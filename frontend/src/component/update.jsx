import { useEffect, useState } from "react";
import Navbarre from "./navbarre";
import { useNavigate, useParams } from "react-router-dom";

function Update() {
  //const [post, setPost] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  //const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')
  const { postParam } = useParams();
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);
    console.log(formData.get('title'))
      fetch("http://localhost:8000/api/post/"+postParam, {
        method: "PUT",
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
    })
    .then((data) => {
        setErrors({});
        setMessage(data.message)
        navigate('/compte')
    })
    .catch((error) => {
        if (error.errors) {
            setErrors(error.errors);
        } 
        else {
            console.error('An error occurred:', error);
        }
    });
  };
  useEffect(()=>{
    fetch("http://localhost:8000/api/post/"+postParam, {
        method: "GET",
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
    })
    .then((data) => {
      setTitle(data.post.title)
      setDescription(data.post.description)
    })
    .catch((error) => {
        console.log(error)
    });
  },[])
  if (localStorage.getItem('token')) {
  return (
    <div>
      <Navbarre/>
      <div className="container">
      <h2>Modifier la post </h2>
      <form onSubmit={(e)=>handleSubmit(e)}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Titre
          </label>
          <input
            type="text"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <span className="invalid-feedback">{errors.title[0]}</span>}
        </div>

        {/* Champ Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && <span className="invalid-feedback">{errors.description[0]}</span>}
        </div>

        {/* Champ Image */}
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Image
          </label>
          <input
            type="file"
            className={`form-control ${errors.image ? 'is-invalid' : ''}`}
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {errors.image && <span className="invalid-feedback">{errors.image[0]}</span>}
        </div>

        {/* Bouton de soumission */}
        <button type="submit" className="btn btn-primary">
          Modifier
        </button>

        {/* Message de retour */}
        {message && <div className="mt-3 alert alert-info">{message}</div>}
      </form>
    </div>
    </div>
  );
  }else{
    useEffect(()=>{
      navigate('/login')
    },[])
  }
}

export default Update;