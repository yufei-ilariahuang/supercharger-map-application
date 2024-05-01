// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MapPage from './pages/MapPage';
import {Auth} from './components/auth';
import {Header} from './components/Header';
import CollectionsListPage from './pages/CollectionsListPage';
import CollectionPage from './pages/CollectionPage';
import DocumentPage from './pages/DocumentPage'

function App() {
  return (
    <BrowserRouter>
      <Header />  {/* Include the Header component */}
      <Routes>
        <Route path="/Home" element={<MapPage />} />
        <Route path="/signin" element={<Auth />} />
        <Route path="/" element={<CollectionsListPage />} />
        <Route path="/collection/:collectionName" element={<CollectionPage />} />
        <Route path="/collection/:collectionName/document/:documentId" element={<DocumentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
