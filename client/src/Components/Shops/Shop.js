import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import LikeIcon from './LikeIcon'
import DislikeIcon from './DislikeIcon'
import Loader from 'react-loader-spinner'
import Button from '@material-ui/core/Button';
import NoImage from '../../assets/no-image.png';


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
    const { classes, shop, like, dislike, location } = this.props;
    return (
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          avatar={
            <img src={shop.icon} alt={shop.name} className={classes.avatar} />
          }
          title={shop.name}
          subheader={"Distance: " + shop.distance + " m"}
        />
        {
          shop.photo.data && (
            <div style={{      
              position: "relative",
              }}>

              <CardMedia
                className={classes.media}
                image={"data:image/jpg;base64, " + shop.photo.data}
              />
                <div style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "100%",
                    width: "100%",
                    opacity: 0.2,
                    backgroundColor: "#EB3349"
                }}>
               </div>
            </div>
          )
        }
        {
          !shop.photo.data && shop.photoRef.length !== 0 && <div style={{textAlign: "center", paddingTop: "45%", height: 300}}>
          <Loader
            type="Grid"
            color="#EB3349"
            height="30"	
            width="30"
          />
        </div>
        }
        {
          shop.photoRef.length === 0 && ( <div style={{textAlign: "center", paddingTop: "45%", height: 300}}>
            <img src={NoImage} alt="no-img-found" height={40} width={40}/>
          </div>)
        }

        <CardActions className={classes.actions} >
          {
            location.pathname !== "/likedShops" && (
              <Button onClick={()=> like(shop)} variant="outlined" style={{borderColor: "#18BC9C"}} className={classes.button}>
                <LikeIcon></LikeIcon>
                Like
              </Button>
            )
          }
 
          <Button onClick={()=> dislike(shop)} variant="outlined" style={{borderColor: "#EB3349"}} className={classes.button}>
            <DislikeIcon></DislikeIcon>
            Dislike
          </Button>
          
        </CardActions>
        
      </Card>
    );
  }
}

RecipeReviewCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RecipeReviewCard);