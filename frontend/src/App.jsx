import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Compte from './component/compte';
import Add from './component/Add';
import Posts from './component/postes';
import Authentification from './component/Authentification';
import Update from './component/update';

export const router = createBrowserRouter([
  {
    path:'/',
    element: <Authentification/>
  },
  {
    path:'/postes',
    element: <Posts/>
  },
  {
    path:'/login',
    element: <Authentification/>
  },
  {
    path:'/singup',
    element: <Authentification/>
  },
  {
    path:'/add',
    element: <Add/>
  },
  {
    path:'/update/:postParam',
    element: <Update/>
  },
  {
    path:'/compte',
    element: <Compte/>,
  }
])
function App() {
  return (
    <RouterProvider router={router}>

    </RouterProvider>
  );

}

export default App
