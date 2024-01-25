import React from 'react';
import ItemCard from './ItemCard';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
        gridContainer: {
                display: 'grid',
                width: '100%',
                gridRowGap: '20px',
                gridColumnGap: '20px',
                gridTemplateColumns: 'repeat(1, 1fr)',
                [theme.breakpoints.up('sm')]: {
                    gridTemplateColumns: 'repeat(2, 1fr)',
                },
                [theme.breakpoints.up('md')]: {
                    gridTemplateColumns: 'repeat(3, 1fr)',
                },
                [theme.breakpoints.up('lg')]: {
                    gridTemplateColumns: 'repeat(4, 1fr)',
                },
                [theme.breakpoints.up('xl')]: {
                    gridTemplateColumns: 'repeat(5, 1fr)',
                },
        },
}));

function ItemGrid({ items }) {
    const classes = useStyles();
    return (
        <div className={classes.gridContainer}>
            {items.map(item => (
                <ItemCard key={item.id} item={item} />
            ))}
        </div>
    );
}

export default ItemGrid;
