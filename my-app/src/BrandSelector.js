import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    button: {
        backgroundColor: 'black', // Make the button black
        color: 'white', // Make the text color white
        fontSize: '0.7em', // Adjust the font size as needed
        fontWeight: 'bold', // Adjust the font weight as needed
        height: '30px', // Adjust the height as needed
        width: 'auto', // Adjust the width as needed
        padding: theme.spacing(2), // Add some padding
        minWidth: 'auto', // Override the min-width property
        border: '1px solid black',
        margin: '20px 0px', // Adjust the margin as needed
        whiteSpace: 'nowrap', // Add this line
        borderRadius: 2, // Adjust the border radius as needed
        '&:hover': {
            backgroundColor: 'grey', // Change color on hover
        },
    },
    buttonViewAll: {
        backgroundColor: 'white', // Make the button black
        border: '1px solid black',
        color: 'black', // Make the text color white
        fontSize: '0.7em', // Adjust the font size as needed
        fontWeight: 'bold', // Adjust the font weight as needed
        height: '30px', // Adjust the height as needed
        width: 'auto', // Adjust the width as needed
        padding: theme.spacing(2), // Add some padding
        minWidth: 'auto', // Override the min-width property
        margin: '20px 0px', // Adjust the margin as needed
        whiteSpace: 'nowrap', // Add this line
        borderRadius: 2, // Adjust the border radius as needed
        '&:hover': {
            backgroundColor: 'grey', // Change color on hover
        },
    },
}));

function BrandSelector({ brands, onBrandSelect }) {
    const classes = useStyles();

    return (
            <div className='main'>
            <Button 
          variant="contained" 
          className={classes.buttonViewAll}
          onClick={() => onBrandSelect('')} // Call onBrandSelect with an empty string when "View All" is clicked
        >
          View All
        </Button>
        {brands.map((brand, index) => (
  <Button 
    variant="contained" 
    className={classes.button}
    onClick={() => onBrandSelect(brand)}
    key={brand}
    style={{ marginRight: index === brands.length - 1 ? '40px' : '0' }} // Add this line
  >
    {brand}
  </Button>
))}
            </div>
    );
}

export default BrandSelector;