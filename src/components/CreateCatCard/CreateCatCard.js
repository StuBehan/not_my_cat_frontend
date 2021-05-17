import React, { useState, useEffect } from 'react';
import { AuthContext } from "../../App";
import axios from 'axios';
import Cat from '../catCard/catCard.js'

const CreateCatCard = (props) => {

  const { state } = React.useContext(AuthContext);
  const [postData, setPostData] = useState({
    catName: "",
    user_id: state.user,
    cattitude: 0,
    floof: 0,
    chonk: 0,
    image: "",
    longitude: 0,
    latitude: 0

  })

  const [invalid, setInvalid] = useState(false)
  const [cattributes, setCattributes] = useState(true)

  const onChange = (element) => {
    setPostData((prevState) => ({...prevState, [element.target.name]: element.target.value }))
  }

  const getLocation = (options) => {
    return new Promise((position, error) => {
      navigator.geolocation.getCurrentPosition(position, error, options)
    })
  }

  useEffect(() => {
    getLocation({timeout:10000})
    .then((position) => {
      setPostData((prevState) => ({...prevState, latitude: position.coords.latitude }))
      setPostData((prevState) => ({...prevState, longitude: position.coords.longitude }))
    })
    .catch((error) => {
      console.log(error)
    })
  }, [])

  const createCat = (element) => {
    element.preventDefault()

    const { cattitude, floof, chonk } = postData
    if (parseFloat(cattitude) + parseFloat(floof) + parseFloat(chonk) > 20) {
        return setCattributes(false)
      } else {
        setCattributes(true)
      }

    axios.post('http://127.0.0.1:8082/api/cats', { postData, accessToken: state.accessToken })
    .then(response => {
      if (response.status === 201) {
        props.history.push('/')
      }
    })
    .catch(error => {
      setInvalid(true)
      console.log(error)
    })
  }

  return (
  <div className="form cat-list-row">
    <div className="form-left">
      <Cat {...postData}/>
    </div>
    <form className="newcat-form" onSubmit={element => createCat(element)}>
      <h3>Add a cat!</h3>
      {!cattributes && <strong>You have overspent on cattributes! 20 Max!</strong>}
      {invalid && <strong>You have missed a cattribute!</strong>}
      <input type="text" name="catName" placeholder="Name of Cat"
        onChange={element => onChange(element)}
      />
      <input type="number" name="cattitude" placeholder="Cattitude" min="1" max="10"
        onChange={element => onChange(element)}
      />
      <input type="number" name="floof" placeholder="Floofiness" min="1" max="10"
        onChange={element => onChange(element)}
      />
      <input type="number" name="chonk" placeholder="Chonk" min="1" max="10"
        onChange={element => onChange(element)}
      />
      <input type="file" name="image" onChange={element => onChange(element)} />
      <input type="submit" className="button"/>
    </form>
  </div>
  );
};

export default CreateCatCard;
