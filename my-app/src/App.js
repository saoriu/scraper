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
  line: {
    width: '100vw',
    position: 'fixed',
    left: '0px',
    height: '74px',
    backgroundColor: 'white',
    borderBottom: '1px solid black',
    zIndex: 1,
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
        const sortedBrands = response.data.sort(); // Sort the brands
        setBrands(sortedBrands);
        setLoadingBrands(false);
      })
      .catch(error => {
        console.error('Error fetching brands: ', error);
        setLoadingBrands(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    const cachedItems = sessionStorage.getItem('items');
    if (cachedItems) {
      setItems(JSON.parse(cachedItems));
      setLoading(false);
    } else {
      axios.get('https://8kserg4k6e.execute-api.us-east-2.amazonaws.com/prod/item')
        .then(response => {
          setItems(response.data);
          sessionStorage.setItem('items', JSON.stringify(response.data));
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching items: ', error);
          setLoading(false);
        });
    }
  }, []);
  
  const handleBrandSelect = (brand) => {
    setLoading(true);
    setItems([]); // Clear existing items when a new brand is selected
    const cachedBrandItems = sessionStorage.getItem(`brand-${brand}`);
    if (cachedBrandItems) {
      setItems(JSON.parse(cachedBrandItems));
      setLoading(false);
    } else {
      axios.get(`https://8kserg4k6e.execute-api.us-east-2.amazonaws.com/prod/item?brand=${brand}`)
        .then(response => {
          setItems(response.data);
          sessionStorage.setItem(`brand-${brand}`, JSON.stringify(response.data));
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data: ', error);
          setLoading(false);
        });
    }
  };

  return (
    <div className='App'>

            {loadingBrands 
          ? <div className={classes.loader}><GridLoader size={30} /></div> 
          : (
      <div className='content'>
            <div className={classes.line}></div> {/* Add this line */}
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