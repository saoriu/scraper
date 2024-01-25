import React, { useState } from 'react';
import { Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Chip } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createTheme({
    typography: {
        fontFamily: '"Poppins", sans-serif',
    },
});

const useStyles = makeStyles({
    card: {
        maxWidth: 345,
        height: '375px',
        perspective: '1000px', // Add perspective
        transform: 'rotateY(0deg)',
        transition: 'transform 0.6s',
        borderRadius: 2, // Add this line to make the corners right angled
        transformStyle: 'preserve-3d',
        border: '1px solid black',
    },
    leftAlign: {
        textAlign: 'left',
    },
    chipRed: {
        backgroundColor: '#db7070',
    },
    chipGreen: {
        backgroundColor: '#54a04f',
    },
    head: {
        fontSize: '0.8rem',
        color: '#f50057',
        fontWeight: 'bold',
    },
    value: {
        fontSize: '0.9rem',
    },
    head1: {
        fontSize: '1.3rem',
        color: '#f50057',
        fontWeight: 'bold',
    },
    value1: {
        fontSize: '2rem',
    },
    noPadding: {
        padding: 0,  // remove padding
        "&:last-child": {
            paddingBottom: 0  // remove bottom padding
        }
    },
    chipContainer: {
        marginTop: '10px', // Adjust this value as needed
    },
    chipTopRight: {
        position: 'absolute',
        top: '0px',
        color: '#fff',
        right: '0px',
        fontSize: '.75rem',
        borderTopLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 2,

    },
    marketKey: {
        fontWeight: 'bold',
        marginRight: '10px',
    },
    marketValue: {
        color: '#333',
    },
    badge: {
        padding: '5px 25px',
        margin: '5px',
    },
    chip: {
        margin: '0 8px',
        borderRadius: 2,
        backgroundColor: '#373737',
    },
    truncate: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    textContainer: {
        width: '100%', // Adjust this value as needed
        overflow: 'hidden',
    },
    flipContainer: {
        position: 'relative',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        transition: 'transform 0.6s',
        transformStyle: 'preserve-3d',
    },
    flipped: {
        transform: 'rotateY(180deg)',
    },
    totalSold: {
        fontSize: '1.2em', // Change this to the font size you want
      },
    front: {
        backfaceVisibility: 'hidden',
        position: 'absolute',
        top: 0,
        height: '375px',
        left: 0,
    },
    back: {
        transform: 'rotateY(180deg)',
        backfaceVisibility: 'hidden',
        position: 'absolute',
        height: '375px',
        top: 0,
        left: 0,
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
    },
    text: {
        color: '#333',
        marginBottom: '10px',
        fontWeight: 'bold',
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
});

const marketKeyTitles = {
    annualHigh: 'Annual High',
    annualLow: 'Annual Low',
    averageDeadstockPrice: 'Average Price',
    changeValue: 'Change',
    deadstockSold: 'Units Sold',
    lastSale: 'Price',
    lastSaleDate: 'Last Sale',
    totalDollars: 'Total Sold',
};

function ItemCard({ item }) {
    const classes = useStyles();
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <ThemeProvider theme={theme}>
            <Card className={classes.card} onClick={handleFlip}>
                <div className={`${classes.flipContainer} ${isFlipped ? classes.flipped : ''}`}>
                    <CardActionArea className={classes.front}>
                        <Chip
                            label={`$${Math.abs(Math.round(Number(item.market.changeValue)))}`} 
                            className={`${classes.chipTopRight} ${item.market.changeValue < 0 ? classes.chipRed : classes.chipGreen}`}
                        />
                        <CardMedia
                            component="img"
                            alt={item.model || 'Item image'}
                            height="140"
                            image={item.media && item.media.thumbUrl}
                            title={item.model}
                        />
                        <CardContent>
                            <Grid container direction="column" justifyContent="space-between" alignItems="stretch">
                                <Grid item className={classes.textContainer}>
                                    <Typography variant="h5" component="h2" className={classes.truncate}>
                                        {item.model}
                                    </Typography>
                                    <Typography variant="body1" component="p">
                                        {item.secondaryTitle}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </CardActionArea>
                    <CardActionArea className={classes.back}>
                    <CardContent className={`${classes.noPadding} ${classes.leftAlign}`}>
                            {item.market && (
                                <Grid container spacing={2}>
                                    <Grid item xs={12}  className={classes.gridOutline}>
                                            <Typography variant="h4" component="h2" className={classes.head1}>
                                                {marketKeyTitles.totalDollars}:
                                            </Typography>
                                            <Typography variant="h4" component="h2" className={classes.value1}>
                                                ${Number(item.market.totalDollars).toLocaleString()}
                                            </Typography>
                                    </Grid>
                                    <Grid item xs={6}  className={classes.gridOutline}>
                                        <Typography variant="body1" component="p" className={classes.head}>
                                            {marketKeyTitles.annualHigh}
                                        </Typography>
                                        <Typography component="p" className={classes.value}>
                                            ${Number(item.market.annualHigh).toLocaleString()}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}  className={classes.gridOutline}>
                                        <Typography component="p" className={classes.head}>
                                            {marketKeyTitles.annualLow}
                                        </Typography>
                                        <Typography variant="body1" component="p" className={classes.value}>
                                            ${Number(item.market.annualLow).toLocaleString()}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}  className={classes.gridOutline}>
                                        <Typography component="p" className={classes.head}>
                                            {marketKeyTitles.averageDeadstockPrice}
                                        </Typography>
                                        <Typography variant="body1" component="p" className={classes.value}>
                                        ${Math.round(Number(item.market.averageDeadstockPrice)).toLocaleString()}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}  className={classes.gridOutline}>
                                        <Typography component="p" className={classes.head}>
                                            {marketKeyTitles.changeValue}
                                        </Typography>
                                        <Typography variant="body1" component="p" className={classes.value}>
                                            {item.market.changeValue > 0 ? '+$' : '-$'}{Math.abs(Number(item.market.changeValue)).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}{" "}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} className={classes.gridOutline}>
                                        <Typography component="p" className={classes.head}>
                                            {marketKeyTitles.lastSaleDate}
                                        </Typography>
                                        <Typography variant="body1" component="p" className={classes.value}>
                                            {new Date(item.market.lastSaleDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}  className={classes.gridOutline}>
                                        <Typography component="p" className={classes.head}>
                                            {marketKeyTitles.lastSale}
                                        </Typography>
                                        <Typography variant="body1" component="p" className={classes.value}>
                                            ${Number(item.market.lastSale).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}  className={classes.gridOutline}>
                                        <Typography component="p" className={classes.head}>
                                            {marketKeyTitles.deadstockSold}
                                        </Typography>
                                        <Typography variant="body1" component="p" className={classes.value}>
                                            {Number(item.market.deadstockSold).toLocaleString()}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            )}
                        </CardContent>
                    </CardActionArea>
                </div>
            </Card>
        </ThemeProvider>
    );
}

export default ItemCard;
