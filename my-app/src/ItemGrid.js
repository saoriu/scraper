import React, { useState } from 'react';
import ItemCard from './ItemCard';
import { makeStyles } from '@material-ui/core/styles';
import InfiniteScroll from 'react-infinite-scroll-component';
import { css } from "@emotion/react";
import GridLoader from "react-spinners/GridLoader";


const useStyles = makeStyles((theme) => ({
    loader: {
        left: '50%',
        position: 'absolute',
        transform: 'translateX(-50%)',
        padding: '50px 0',
         },
        gridContainer: {
                display: 'grid',
                paddingTop: '5px',
                overflowY: 'visible',
                width: '98%',
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

function ItemGrid({ items, sortBy }) {
    const classes = useStyles();
    const [count, setCount] = useState(30); // Start with first 7 items

    const fetchMoreData = () => {
        // a fake async api call like which sends
        // 10 more records in 1.5 secs
        setTimeout(() => {
            setCount(count + 30);
        }, 1000);
    };

    return (
        <InfiniteScroll
            dataLength={count} //This is important field to render the next data
            next={fetchMoreData}
            hasMore={count < items.length}
            loader={<GridLoader className={classes.loader} color={"black"} loading={true} size={15} />}
        >
            <div className={classes.gridContainer}>
                {items.slice(0, count).map((item, index) => (
                    <ItemCard key={index} item={item} sortBy={sortBy} />
                ))}
            </div>
        </InfiniteScroll>
    );
}

export default ItemGrid;
