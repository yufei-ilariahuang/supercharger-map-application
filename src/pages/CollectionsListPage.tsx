// src/pages/CollectionsListPage.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import collectionNames from './collectionNames';  // Import the list of collections
import { List, ListItem, ListItemText, Typography, Container, Paper, ListSubheader } from '@mui/material';
interface GroupedCollections {
  [key: string]: string[];
}
const CollectionsListPage: React.FC = () => {
  const groupByCountry = (collections: string[]): GroupedCollections => {
    return collections.reduce<GroupedCollections>((group, name) => {
      // Extract the last part of the name as the country
      const parts = name.split('_');
      let country = parts[parts.length - 1];
      switch (country) {
        case 'Kong':
          country = 'Hong Kong';
          break;
        case 'States':
          country = 'United States';
          break;
        case 'Rico':
          country = 'Puerto Rico';
          break;
        case 'Republic':
          country = 'Czech Republic';
          break;
        case 'Mainland':
          country = 'China Mainland';
          break;
        default:
          country = country.replace(/_/g, ' ');
      }

      group[country] = group[country] ?? [];
      group[country].push(name);
      return group;
    }, {});
  };
  const groupedCollections = groupByCountry(collectionNames);
  return (
    <Container component={Paper} elevation={6} sx={{ mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Collections
        </Typography>
        {Object.entries(groupedCollections).map(([country, collections], index) => (
          <List key={index} subheader={<ListSubheader>{country.replace(/_/g, ' ')}</ListSubheader>}>
            {collections.map((collectionName) => (
              <ListItem button component={RouterLink} to={`/collection/${collectionName}`} key={collectionName}>
                <ListItemText primary={collectionName.replace(/_/g, ' ')} />
              </ListItem>
            ))}
          </List>
      ))}
    </Container>
  );
};

export default CollectionsListPage;
