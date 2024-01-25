import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    stickyContainer: {
        position: 'sticky',
        top: 0, // Adjust this value as needed
    },
    button: {
        backgroundColor: 'black', // Make the button black
        color: 'white', // Make the text color white
        fontSize: '0.7em', // Adjust the font size as needed
        fontWeight: 'bold', // Adjust the font weight as needed
        width: '120px', // Adjust the width as needed
        height: '30px', // Adjust the height as needed
        margin: '10px 0px', // Adjust the margin as needed
        borderRadius: 2, // Adjust the border radius as needed
        '&:hover': {
            backgroundColor: 'grey', // Change color on hover
        },
    },
    buttonViewAll: {
        backgroundColor: 'white', // Make the button black
        color: 'black', // Make the text color white
        fontSize: '0.7em', // Adjust the font size as needed
        border: '1px solid black', // Add a border around the button
        fontWeight: 'bold', // Adjust the font weight as needed
        width: '120px', // Adjust the width as needed
        height: '30px', // Adjust the height as needed
        margin: '10px 0px', // Adjust the margin as needed
        borderRadius: 2, // Adjust the border radius as needed
        '&:hover': {
        backgroundColor: 'grey', // Change color on hover
        },
    },
}));

function BrandSelector({ brands, onBrandSelect }) {
    const classes = useStyles();

    return (
        <div className={classes.stickyContainer}>
            <div className='main'>
            <Button 
          variant="contained" 
          className={classes.buttonViewAll}
          onClick={() => onBrandSelect('')} // Call onBrandSelect with an empty string when "View All" is clicked
        >
          View All
        </Button>
                {brands.map(brand => (
                    <Button 
                        variant="contained" 
                        className={classes.button}
                        onClick={() => onBrandSelect(brand)}
                        key={brand}
                    >
                        {brand}
                    </Button>
                ))}

                <h1>by saori uchida</h1>
            </div>
        </div>
    );
}

export default BrandSelector;