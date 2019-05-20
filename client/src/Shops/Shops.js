import React, { Component } from 'react'
import Shop from './Shop';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    margin: "30px 50px",
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class Shops extends Component {
    
    render() {
        const { classes, shops, like, dislike, ...rest } = this.props;
        
        const generatedShops = shops && shops.length !== 0 ? shops.map( (shop,index) => {
            return (
                <Grid item xs={12} sm={6} md={3} key={index}>

                    <Shop
                            name={shop.name}    
                            icon={shop.icon}
                            shopId={shop._id}
                            photo={shop.photo.data}
                            like={like}
                            dislike={dislike}
                            { ...rest }
                        >
                    </Shop>
                </Grid>
            )
        }) : "";

        return (
            <div className={classes.root} >
                <Grid container spacing={24}>
                {
                    generatedShops
                }
                </Grid>
            </div>
        )
    }
}

Shops.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(Shops)