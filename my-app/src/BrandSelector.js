import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    stickyContainer: {
        position: 'sticky',
        top: 0, // Adjust this value as needed
    },
}));

function BrandSelector({ brands, onBrandSelect }) {
    const classes = useStyles();

    return (
        <div className={classes.stickyContainer}>
            <div className='main'>
                <h1>scrape it</h1>
                <h2>by saori</h2>
                <select onChange={e => onBrandSelect(e.target.value)} defaultValue="">
                    <option value="" disabled>Select a brand</option>
                    {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default BrandSelector;