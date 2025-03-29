import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Authentification() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);
    const [isActive, setIsActive] = useState(false); // État pour gérer l'activation du conteneur
    const navigate = useNavigate();

    const formData = new FormData();

    const handleSignUp = (e) => {
        e.preventDefault();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('image', image);

        fetch('http://localhost:8000/api/register', {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(err => {
                        throw err;
                    });
                }
            })
            .then((data) => {
                setErrors({});
                navigate('/compte');
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            })
            .catch((error) => {
                if (error.errors) {
                    setErrors(error.errors);
                } else {
                    console.error('An error occurred:', error);
                }
            });
    };

    const handleSignIn = (e) => {
        e.preventDefault();
        formData.append('email', email);
        formData.append('password', password);

        fetch('http://localhost:8000/api/login', {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    return response.json().then(err => {
                        throw err;
                    });
                }
            })
            .then((data) => {
                setErrors({});
                navigate('/compte');
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            })
            .catch((error) => {
                if (error.errors) {
                    setErrors(error.errors);
                    setError(null);
                } else if (error.error) {
                    setError(error.error);
                    setErrors({});
                } else {
                    console.error('An error occurred:', error);
                }
            });
    };

    // Fonctions pour gérer les clics
    const logInClick = () => {
        setIsActive(false); // Désactive le conteneur
    };

    const singUpClick = () => {
        setIsActive(true); // Active le conteneur
    };

    return (
        <div className={`mycontainer ${isActive ? 'active' : ''}`} id="mycontainer">
            <div className="form-mycontainer sign-up">
                <form onSubmit={handleSignUp}>
                    <h1>Create Account</h1>
                    <span>or use your email for registration</span>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password[0]}</div>}
                    </div>
                    <div className="form-group">
                        <label>Image</label>
                        <input
                            type="file"
                            className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                        {errors.image && <div className="invalid-feedback">{errors.image[0]}</div>}
                    </div>
                    <button type="submit" onClick={singUpClick}>
                        Sign up
                    </button>
                </form>
            </div>
            <div className="form-mycontainer sign-in">
                {error && <span className="error">{error}</span>}
                <form onSubmit={handleSignIn}>
                    <h1>Sign In</h1>
                    <span>or use your email password</span>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <span className="invalid-feedback">{errors.email[0]}</span>}
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <span className="invalid-feedback">{errors.password[0]}</span>}
                    </div>
                    <button type="submit" onClick={logInClick}>Sign In</button>
                </form>
            </div>
            <div className="toggle-mycontainer">
                <div className="toggle">
                    <div className="toggle-panel toggle-left">
                        <h1>Welcome Back!</h1>
                        <p>Enter your personal details to use all of site features</p>
                        <button className="hidden" id="login" onClick={logInClick}>Sign In</button>
                    </div>
                    <div className="toggle-panel toggle-right">
                        <h1>Hello, Friend!</h1>
                        <p>Register with your personal details to use all of site features</p>
                        <button className="hidden" id="register" onClick={singUpClick}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    );
}