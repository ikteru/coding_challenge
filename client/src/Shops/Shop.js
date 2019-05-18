import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from './FavoriteIcon'
import TrashIcon from './TrashIcon'

import { BACKEND_URL } from '../configs';

const styles = theme => ({
  card: {
    maxWidth: 400,
  },
  header:{
    height: 60
  },
  media: {
    height: 300,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  avatar: {
    width: 35,
  },
});

class RecipeReviewCard extends React.Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          avatar={
            <img alt="Remy Sharp" src={this.props.icon} className={classes.avatar} />
          }
          title={this.props.name}
          //subheader="September 14, 2016"
        />

        <CardMedia
          className={classes.media}
          image={BACKEND_URL + "/shops/" + this.props.shopId + "/photo"}
          title="Paella dish"
        />

        {/* <CardContent>
          <Typography component="p">
            This impressive paella is a perfect party dish and a fun meal to cook together with your
            guests. Add 1 cup of frozen peas along with the mussels, if you like.
          </Typography>
        </CardContent> */}

        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton aria-label="Add to favorites" onClick={()=> console.log("Fav Icon Clicked")}>
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="Share" onClick={()=> console.log("Trash Icon Clicked")}>
            <TrashIcon />
          </IconButton>
          
        </CardActions>
        
      </Card>
    );
  }
}

RecipeReviewCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RecipeReviewCard);