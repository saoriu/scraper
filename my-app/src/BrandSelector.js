import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { ReactComponent as SortUp } from './sort-up.svg';
import { ReactComponent as SortDown } from './sort-down.svg';

const useStyles = makeStyles((theme) => ({
    select: {
        backgroundColor: 'white', // Make the select background white
        color: 'black', // Make the text color black
        minWidth: '150px', // Adjust the width as needed
        maxWidth: '150px', // Adjust the width as needed
        fontSize: '0.8em', // Adjust the font size as needed
        fontWeight: '500', // Adjust the font weight as needed
        height: '30px', // Adjust the height as needed
        width: 'auto', // Adjust the width as needed
        padding: theme.spacing(2), // Add some padding
        border: '1px solid black',
        margin: '20px 0px', // Adjust the margin as needed
        whiteSpace: 'nowrap', // Add this line
        borderRadius: 2, // Adjust the border radius as needed
        '&:hover': {
            backgroundColor: 'white', // Change color on hover
        },
    },
    button: {
        backgroundColor: 'white', // Make the button black
        color: 'black', // Make the text color white
        fontSize: '0.8em', // Adjust the font size as needed
        fontWeight: '500', // Adjust the font weight as needed
        height: '30px', // Adjust the height as needed
        width: 'auto', // Adjust the width as needed
        padding: theme.spacing(2), // Add some padding
        minWidth: 'auto', // Override the min-width property
        border: '1px solid black',
        margin: '20px 0px', // Adjust the margin as needed
        whiteSpace: 'nowrap', // Add this line
        textTransform: 'none', // Add this line
        borderRadius: 2, // Adjust the border radius as needed
        '&:hover': {
            boxShadow: 'none', // Remove the box shadow
backgroundColor: 'white', // Change color on hover
        },
    },
    buttonSort: {
        backgroundColor: 'white', // Make the button black
        color: 'white', // Make the text color white
        fontSize: '0.8em', // Adjust the font size as needed
        fontWeight: 'bold', // Adjust the font weight as needed
        textTransform: 'none', // Add this line
        height: '30px', // Adjust the height as needed
        width: 'auto', // Adjust the width as needed
        padding: theme.spacing(2), // Add some padding
        minWidth: 'auto', // Override the min-width property
        border: '1px solid black',
        margin: '20px 0px', // Adjust the margin as needed
        whiteSpace: 'nowrap', // Add this line
        borderRadius: 2, // Adjust the border radius as needed

        '&:hover': {
            backgroundColor: 'white', // Change color on hover
            boxShadow: 'none', // Remove the box shadow
        },
    },
    buttonViewAll: {
        backgroundColor: 'white', // Make the button black
        border: '1px solid black',
        color: 'black', // Make the text color white
        fontSize: '0.8em', // Adjust the font size as needed
        textTransform: 'none', // Add this line
        fontWeight: '500', // Adjust the font weight as needed
        height: '30px', // Adjust the height as needed
        width: 'auto', // Adjust the width as needed
        padding: theme.spacing(2), // Add some padding
        minWidth: 'auto', // Override the min-width property
        margin: '20px 0px', // Adjust the margin as needed
        whiteSpace: 'nowrap', // Add this line
        borderRadius: 2, // Adjust the border radius as needed
        '&:hover': {
            backgroundColor: 'white', // Change color on hover
            boxShadow: 'none', // Remove the box shadow
        },
    },
}));

function BrandSelector({ brands, onBrandSelect, onSort, flipSortDirection, sortDirection, setSortBy, sortBy = 'changeValue', onViewAll }) {
    const classes = useStyles();
    const [selectedOption, setSelectedOption] = useState(sortBy);

    useEffect(() => {
        setSelectedOption(sortBy);
    }, [sortBy]);

    return (
        <div className='main'>
            <div className='filters'>
                <Select
                    value={selectedOption}
                    onChange={(event) => {
                        setSelectedOption(event.target.value);
                        setSortBy(event.target.value);
                        onSort(event.target.value);
                    }}
                    displayEmpty
                    className={classes.select}>
                    <MenuItem value="" disabled>
                        Sort By
                    </MenuItem>
                    <MenuItem value={'changeValue'}>Change</MenuItem>
                    <MenuItem value={'deadstockSold'}>Units Sold</MenuItem>
                    <MenuItem value={'totalDollars'}>Total Dollars</MenuItem>
                    <MenuItem value={'averageDeadstockPrice'}>Average Price</MenuItem>
                    <MenuItem value={'lastSale'}>Last Sale Date</MenuItem>
                </Select>
                <Button
                    variant="contained"
                    className={classes.buttonSort}
                    onClick={flipSortDirection}
                >
                    {sortDirection === 'asc' ? <SortDown /> : <SortUp />}
                </Button>
                <Button
                    variant="contained"
                    className={classes.buttonViewAll}
                    onClick={onViewAll} // Call handleViewAll when "View All" is clicked
                >
                    View All
                </Button>
            </div>
            {brands.map((brand, index) => (
                <Button
                    variant="contained"
                    className={classes.button}
                    onClick={() => onBrandSelect(brand)}
                    key={brand}
                    style={{
                        marginRight: index === brands.length - 1 ? '40px' : '0',
                        marginLeft: index === 0 ? '5px' : '0' // Add this line
                    }}                >
                    {brand}
                </Button>
            ))}
        </div>
    );
}
export default BrandSelector;