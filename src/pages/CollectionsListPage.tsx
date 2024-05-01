// src/pages/CollectionsListPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import collectionNames from './collectionNames';  // Import the list of collections

const CollectionsListPage = () => {
  return (
    <div>
      <h1>Collections</h1>
      <ul>
        {collectionNames.map((name, index) => (
          <li key={index}>
            <Link to={`/collection/${name}`}>{name.replace(/_/g, ' ')}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollectionsListPage;
