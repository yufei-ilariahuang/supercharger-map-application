// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
// import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

export const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/search?searchTerm=${searchTerm}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchTermFromURL = params.get('searchTerm');
    if (searchTermFromURL) {
      setSearchTerm(searchTermFromURL);
    }
  }, []);

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          One Click
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            sx={{ marginRight: 1, backgroundColor: 'background.paper' }}
          />
          <IconButton type="submit" color="inherit">
            {/* <SearchIcon /> */}
          </IconButton>
        </form>
        <Button color="inherit" component={RouterLink} to="/Map">Home</Button>
        <Button color="inherit" component={RouterLink} to="/signin">Sign In</Button>
        <Button color="inherit" component={RouterLink} to="/">COLLECTIONS</Button>
      </Toolbar>
    </AppBar>
  );
};
