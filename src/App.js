import React from 'react';
import './App.css';
import LoginButton from './components/LoginButton/LoginButton.js'
import LogoutButton from './components/LogoutButton/LogoutButton.js'
import SignUpButton from './components/SignUpButton/SignUpButton.js'
import SignUpForm from './components/SignUpForm/SignUpForm.js'
import LoginForm from './components/LoginForm/LoginForm.js'
import CreateCatCardButton from './components/CreateCatCardButton/CreateCatCardButton.js'
import CreateCatCard from './components/CreateCatCard/CreateCatCard.js'
import CatList from './components/catList/catList.js'
import Tabs from './components/Tab/Tabs.js'
import MapContainer from './components/MapContainer/MapContainer.js'
import UserProfile from './components/UserProfile/UserProfile.js'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { ReactComponent as Copse } from './svg/copse.svg'
import { ReactComponent as CatImg } from './svg/cat1.svg'
import useCats from './hooks/useCats'

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  accessToken: null
}

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.data.user));
      localStorage.setItem("accessToken", JSON.stringify(action.data.accessToken));
      return {
        ...state,
        isAuthenticated: true,
        user: action.data.user,
        accessToken: action.data.accessToken
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        isAuthenticated: false,
        user: null,
        accessToken: null
      };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [listCats] = useCats();

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || null)
    const accessToken = JSON.parse(localStorage.getItem("accessToken") || null)

    if (user && accessToken) {
      dispatch({ type: "LOGIN", data: { user, accessToken }})
    }
  }, [state.isAuthenticated])

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch
      }}>
      <div className="App">
        <Router>
          <header className="App-header">
            <CatImg />
            <Link to="/" className="title"><h1 className="title">NOT MY CAT</h1></Link>
            <Copse />
            {state.isAuthenticated && <div className="speech-bubble">
              <h3>What up {state.user}!</h3>
            </div>}
          </header>
          <div className="nav">
              {!state.isAuthenticated ? <>
              <LoginButton />
              <SignUpButton />
              </> : <><LogoutButton />
              <CreateCatCardButton />
              <Link to='/profile' className='button'>Profile</Link></>}
            </div>
          <div className="cat-list">
            <Route path= '/signup' component={SignUpForm} />
            <Route path= '/new-cat' component={CreateCatCard} />
            <Route path= '/login' component={LoginForm} />
            <Route path= '/profile'>
              <p className="latest-cats">Here are all your cats!</p>
              <UserProfile />
            </Route>
          </div>
          {!state.isAuthenticated ? <p className="latest-cats">Login to see all the latest cats</p>
          : <p className="latest-cats">Here are all the finest picks!</p>}
          <Tabs className="tabs-div">
            <div label="view all cats">
              <CatList props={state} list={listCats} />
            </div>
            <div label="view cat map">
              <MapContainer className="cat-map" />
            </div>
          </Tabs>
        </Router>
      </div>
    </AuthContext.Provider>
  );
}
