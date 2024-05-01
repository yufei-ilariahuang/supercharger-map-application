// src/pages/CollectionsListPage.tsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { List, ListItem, ListItemText, Typography, Container, Paper, ListSubheader } from '@mui/material';
import collectionNames from './collectionNames';  // Ensure this imports correctly

interface GroupedCollections {
  [key: string]: string[];
}

const CollectionsListPage: React.FC = () => {
  // Function to group collections by the last element in their names
  const groupByCountry = (collections: string[]): GroupedCollections => {
    return collections.reduce<GroupedCollections>((group, name) => {
      const parts = name.split('_');
      let country = parts[parts.length - 1];

      // Normalize country name based on specific cases
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
        Collections by Country/Category
      </Typography>
      {Object.entries(groupedCollections).map(([country, collections], index) => (
        <List key={index} subheader={<ListSubheader>{country}</ListSubheader>}>
          {collections.map((collectionName) => (
            <ListItem button component={RouterLink} to={`/collection/${collectionName}`} key={collectionName}>
              <ListItemText primary={collectionName.replace(/_/g, ' ').replace(new RegExp(` ${country}$`, 'i'), '')} />
            </ListItem>
          ))}
        </List>
      ))}
    </Container>
  );
};

export default CollectionsListPage;
