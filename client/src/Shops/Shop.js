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
    const { classes, shopId, like, dislike, location } = this.props;
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
          image={"data:image/jpg;base64, " + this.props.photo}
          title="Paella dish"
        />

        {/* <CardContent>
          <Typography component="p">
            This impressive paella is a perfect party dish and a fun meal to cook together with your
            guests. Add 1 cup of frozen peas along with the mussels, if you like.
          </Typography>
        </CardContent> */}

        <CardActions className={classes.actions} disableActionSpacing>
          {
            location.pathname !== "/likedShops" && (
              <IconButton aria-label="Like" onClick={()=> like(shopId)}>
                <FavoriteIcon />
              </IconButton>
            )
          }
          
          <IconButton aria-label="Dislike" onClick={()=> dislike(shopId)}>
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