import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState} from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {db} from "./config/firebase-config"
import './App.css';
import {getDocs, collection} from "firebase/firestore";

// function App() {
//   const [superchargerList, setSuperChargerList] = useState([]);
//   const superchargerCollectionRef = collection(db, "superchargers")
//   useEffect(()=> {
//     const getSuperChargerList = async ()=> {
//     //Read data
//     //set supercharger list
//       try{
//         const data = await getDocs(superchargerCollectionRef);
//         //log data according to field
//         const filteredData = data.docs.map((doc) => ({
//           ...doc.data(), 
//           id: doc.id,
//         }));
//         console.log(filteredData);//need to be modified
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     getSuperChargerList();
//   })
//   const getSuperChargerList = () => {

//   }
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
//           <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           <Marker position={[51.505, -0.09]}>
//             <Popup>
//               A pretty CSS3 popup. <br /> Easily customizable.
//             </Popup>
//           </Marker>
//         </MapContainer>} />
//         <Route path="/auth" element={<Auth />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
import MapPage from './pages/MapPage';
import { Auth } from './components/auth';
import { Header } from './components/Header';
import CollectionsListPage from './pages/CollectionsListPage';
import CollectionPage from './pages/CollectionPage';

function App() {
  return (
    <BrowserRouter>
      <Header />  {/* Include the Header component */}
      <Routes>
        <Route path="/Map" element={<MapPage />} />
        <Route path="/signin" element={<Auth />} />
        <Route path="/" element={<CollectionsListPage />} />
        <Route path="/collection/:collectionName" element={<CollectionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
