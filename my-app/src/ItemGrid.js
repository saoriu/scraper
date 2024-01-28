import React from 'react';
import ItemCard from './ItemCard';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
        gridContainer: {
                display: 'grid',
                overflowX: 'hidden',
                width: '100%',
                marginTop: '100px',
                gridRowGap: '20px',
                gridColumnGap: '20px',
                gridTemplateColumns: 'repeat(2, 1fr)',
                [theme.breakpoints.up('sm')]: {
                    gridTemplateColumns: 'repeat(3, 1fr)',
                },
                [theme.breakpoints.up('md')]: {
                    gridTemplateColumns: 'repeat(4, 1fr)',
                },
                [theme.breakpoints.up('lg')]: {
                    gridTemplateColumns: 'repeat(5, 1fr)',
                },
                [theme.breakpoints.up('xl')]: {
                    gridTemplateColumns: 'repeat(6, 1fr)',
                },
        },
}));

function ItemGrid({ items }) {
    const classes = useStyles();
    return (
        <div className={classes.gridContainer}>
            {items.map((item, index) => (
                <ItemCard key={index} item={item} />
            ))}
        </div>
    );
}

export default ItemGrid;
