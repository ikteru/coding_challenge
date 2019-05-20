import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';

import CustomButton from "../assets/CustomButton";

import authClient from "../Auth/Auth";
import { withRouter } from "react-router-dom";
import CustomLink from "../assets/CustomLink";

const styles = theme =>({
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

function NavBar(props) {

    const signOut = () => {
        authClient.signOut();
        props.history.replace('/');
    };
    const { classes } = props;

    const { isAuthenticated, signIn, getProfile } = authClient;
    //console.log("Profile: ", getProfile() );
    return (
      <div className={classes.root}>
      <AppBar position="static" style={{ background: "white" }}>
        <Toolbar>
            <Typography variant="h6" color="primary" className={classes.grow}>
              <CustomLink to="/">
                Random.io
              </CustomLink>
            </Typography>
            <div className={classes.sectionDesktop}>
            <CustomLink to="/nearbyShops">
            <CustomButton>Nearby Shops</CustomButton>
            </CustomLink>
            
            <CustomLink to="/likedShops">
            <CustomButton>Liked Shops</CustomButton>
            </CustomLink>
            
            {isAuthenticated() && (
              <span style={{paddingTop: 10}}>
                
                <Chip
                  icon={<FaceIcon />}
                  label={getProfile().name}
                  className={classes.chip}
                  variant="outlined"
                />
              </span>
            )
            }
            {!isAuthenticated() && (<CustomButton onClick={signIn}>Sign in</CustomButton>)}
            {isAuthenticated() && ( <CustomButton onClick={signOut}>Sign out</CustomButton> )}
            </div>
            
          {/* <div className={classes.grow} />  */}
          {
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" color="primary">
                <MoreIcon />
              </IconButton>
            </div> 
          }
        </Toolbar>


      </AppBar>
    </div>
    );
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(NavBar));
