import React, { useState, useEffect } from 'react';
import BrandSelector from './BrandSelector';
import ItemGrid from './ItemGrid';
import axios from 'axios';
import GridLoader from "react-spinners/GridLoader";
import './App.css';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw', // Adjust as needed
    height: '100vh', // Adjust as needed
  },
}));

function App() {
  const classes = useStyles();
  const [brands, setBrands] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(true);

  useEffect(() => {
    axios.get('https://8kserg4k6e.execute-api.us-east-2.amazonaws.com/prod/brands')
      .then(response => {
        setBrands(response.data);
        setLoadingBrands(false);
      })
      .catch(error => {
        console.error('Error fetching brands: ', error);
        setLoadingBrands(false);
      });
  }, []);

    // New useEffect hook to fetch all items when the component mounts
    useEffect(() => {
      setLoading(true);
      axios.get('https://8kserg4k6e.execute-api.us-east-2.amazonaws.com/prod/item')
        .then(response => {
          setItems(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching items: ', error);
          setLoading(false);
        });
    }, []);

  const handleBrandSelect = (brand) => {
    setLoading(true);
    setItems([]); // Clear existing items when a new brand is selected
    axios.get(`https://8kserg4k6e.execute-api.us-east-2.amazonaws.com/prod/item?brand=${brand}`)
      .then(response => {
        setItems(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
        setLoading(false);
      });
  };

  return (
    <div className='App'>
            {loadingBrands 
          ? <div className={classes.loader}><GridLoader size={30} /></div> 
          : (
      <div className='content'>
        <BrandSelector brands={brands} onBrandSelect={handleBrandSelect} />
        {loading 
          ? <div className={classes.loader}><GridLoader size={30} /></div> 
          : <ItemGrid items={items} />}
      </div>
      )}
    </div>
  );
}

export default App;