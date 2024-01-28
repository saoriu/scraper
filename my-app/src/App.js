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
    hiddenText: {
      opacity: 0,
      transform: 'translateX(-100%)', // Start from the left
      transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
      whiteSpace: 'nowrap', // Add this line
    },
    footer: {
      width: '30px', // Initial width
      height: '30px', // Initial height
      transition: 'width 0.5s ease-in-out',
      overflow: 'hidden', // Add this line
      '&:hover': {
        width: '200px', // Width on hover
      },
      '&:hover $hiddenText': {
        opacity: 1,
        transform: 'translateX(0)', // End at the original position
      },
    },
  logo: {
    width: '30px',
    height: '30px',
    marginRight: '10px',
  },
  saori: {
    color: 'black',
    zIndex: 5,
    bottom: '0px',
    textDecoration: 'none',
    '&:hover': {
      color: 'black',
      textDecoration: 'none',
    },
  },
  line: {
    width: '100vw',
    position: 'fixed',
    left: '0px',
    height: '74px',
    background: 'linear-gradient(90deg, #d8d8d8 5%, #fdfdfd 10%, #fdfdfd 99%, #d8d8d8 105%)',
    borderBottom: '1px solid black',
    zIndex: 2,
  },
}));

function App() {
  const classes = useStyles();
  const [sortBy, setSortBy] = useState('changeValue');
  const [brands, setBrands] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState(''); // Add this line
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');


  

  useEffect(() => {
    axios.get('https://8kserg4k6e.execute-api.us-east-2.amazonaws.com/prod/brands')
      .then(response => {
        const sortedBrands = response.data.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())); // Sort the brands case-insensitively
        setBrands(sortedBrands);
        setLoadingBrands(false);
      })
      .catch(error => {
        console.error('Error fetching brands: ', error);
        setLoadingBrands(false);
      });
  }, []);

  const sortItems = (items, sortBy = 'changeValue', sortDirection = 'desc') => {
    return [...items].sort((a, b) => {
      if (a.market[sortBy] < b.market[sortBy]) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (a.market[sortBy] > b.market[sortBy]) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const handleSort = () => {
    setLoading(true);
    let allItems = JSON.parse(sessionStorage.getItem('items')) || [];
    if (searchQuery) {
      allItems = allItems.filter(item => 
        item.model.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.secondaryTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedBrand) {
      allItems = allItems.filter(item => item.brand === selectedBrand);
    }
    let sortedItems;
    if (sortDirection === 'desc') {
      sortedItems = allItems.sort((a, b) => a.market[sortBy] - b.market[sortBy]);
    } else {
      sortedItems = allItems.sort((a, b) => b.market[sortBy] - a.market[sortBy]);
    }
    setItems(sortedItems);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const flipSortDirection = () => {
    setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
  };
  
  useEffect(() => {
    if (sortBy) {
      handleSort();
    }
  }, [sortDirection, sortBy]);
  
  useEffect(() => {
    setLoading(true);
    const cachedItems = sessionStorage.getItem('items');
    if (cachedItems) {
      setItems(sortItems(JSON.parse(cachedItems)));
      setLoading(false);
    } else {
      axios.get('https://8kserg4k6e.execute-api.us-east-2.amazonaws.com/prod/item')
        .then(response => {
          const sortedItems = sortItems(response.data);
          setItems(sortedItems);
          sessionStorage.setItem('items', JSON.stringify(sortedItems));
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
    setSelectedBrand(brand);
    const allItems = JSON.parse(sessionStorage.getItem('items')) || [];
    const filteredItems = allItems.filter(item => item.brand === brand);
    setItems(sortItems(filteredItems, sortBy)); // Pass sortBy to sortItems
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewAll = () => {
    setLoading(true);
    setSelectedBrand('');
    const allItems = JSON.parse(sessionStorage.getItem('items')) || [];
    setItems(sortItems(allItems, sortBy)); // Pass sortBy to sortItems
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSearch = (event) => {
    event.preventDefault();
    setLoading(true);
    const allItems = JSON.parse(sessionStorage.getItem('items')) || [];
    const filteredItems = allItems.filter(item => 
      item.model.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.secondaryTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) // Include brand in search criteria
    );
    setItems(sortItems(filteredItems, sortBy)); // Pass sortBy to sortItems
    setLoading(false);
  };

  return (
    <div className='App'>

            {loadingBrands 
          ? <div className={classes.loader}><GridLoader size={30} /></div> 
          : (
      <div className='content'>
            <div className={classes.line}></div>
        <BrandSelector 
          brands={brands} 
          onBrandSelect={handleBrandSelect} 
          setSortBy={setSortBy} 
          onViewAll={handleViewAll} 
          onSort={handleSort} 
          flipSortDirection={flipSortDirection} 
          sortDirection={sortDirection}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={onSearch}
        />                
        {loading 
          ? <div className={classes.loader}><GridLoader size={30} /></div> 
          : <ItemGrid items={items} sortBy={sortBy} />}
      </div>
      )}
      <div className={`${classes.footer} footer`}>
        <img src="/logo.png" alt="Logo" className={classes.logo} />
        <a href='https://saoriuchida.com' className={classes.saori} target='_blank' rel='noopener noreferrer'>
          <span className={classes.hiddenText}>Scrapeit by Saori Uchida</span>
        </a>
      </div>
    </div>
  );
}

export default App;