// import './App.css';
import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import useCats from '../../hooks/use-cats';
import CatMapList from '../catMapList/catMapList.js'
require ('dotenv/config');

const MapContainer = () => {

  const mapStyles = {
    height: "80vh",
    width: "80%",
    margin: 'auto'};

  const defaultCenter = {
    lat:51.523490, lng: 0.076864
  }

  return (
    <LoadScript
      googleMapsApiKey='AIzaSyCwHGfQTy_Eg2pSkOq-svnJCmB1f4fK54M'>
      <GoogleMap
      mapContainerStyle={mapStyles}
      zoom={13}
      center={defaultCenter}
      />
    </LoadScript>
  )
}

export default MapContainer;
