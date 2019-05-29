import React from 'react';
//Material UI Dependencies
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
//Custom UI dependencies
import CustomLink from "../CustomLink/CustomLink";
import CustomButton from "../CustomButton/CustomButton";
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
//Authentication dependency
import authClient from "../../Auth/Auth";

import { withRouter } from 'react-router-dom';

const styles = theme => ({

  grow: {
    flexGrow: 1,
  },

  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
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
})

class NavBar extends React.Component {
  constructor(props){
    super(props)
    this.state={
      mobileMoreAnchorEl: null,
    }
    this.signOut = this.signOut.bind(this);
    this.handleMobileMenuClose = this.handleMobileMenuClose.bind(this);
    this.handleMobileMenuOpen = this.handleMobileMenuOpen.bind(this);
  }
  
  //Signs out the user and redirects them to the Home page
  signOut(){
    authClient.signOut();
    this.props.history.replace('/');
  }
  //Used in Mobile view to open the now minified menu 
  handleMobileMenuOpen(event) {
    this.setState({ mobileMoreAnchorEl: event.currentTarget});
  }
  
  //Used in Mobile view to close the menu
  handleMobileMenuClose() {
    this.setState({ mobileMoreAnchorEl: null});
  }



  render(){
    const { isAuthenticated, getProfile, signIn } = authClient;
    const { classes } = this.props;
    const isMobileMenuOpen = Boolean(this.state.mobileMoreAnchorEl);
    
    //The mobile version of the menu, rendered in the mobile view
    const renderMobileMenu = (
      <Menu
        anchorEl={this.state.mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        {isAuthenticated() && (
          <MenuItem style={{color: "#EB3349"}}>
            <span >
              
              <Chip
                icon={<FaceIcon />}
                label={getProfile().name}
                className={classes.chip}
                variant="outlined"
              />
            </span>
          </MenuItem>
        )
        }
        <MenuItem style={{color: "#EB3349"}}>
          <CustomLink to="/nearbyShops">
            Nearby Shops
          </CustomLink>
        </MenuItem>
        <MenuItem style={{color: "#EB3349"}}>
          <CustomLink to="/likedShops">
              Liked Shops
          </CustomLink>
        </MenuItem>
        {!isAuthenticated() && (
          <MenuItem style={{color: "#EB3349"}}>
            <span onClick={signIn}>Sign in</span>
          </MenuItem>
        )}
        {isAuthenticated() && ( 
          <MenuItem style={{color: "#EB3349"}}>
            <span onClick={this.signOut}>Sign out</span> 
          </MenuItem>
        )}
      
      </Menu>
    );


    return (
      
      <div className={classes.grow}>
        <AppBar position="static" style={{background: "white"}}>
          <Toolbar>

            <Typography variant="h6" color="primary" className={classes.grow}>
              <CustomLink to="/">
                Random.shop
              </CustomLink>
            </Typography>
          
            <div className={classes.grow} />
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
                  {isAuthenticated() && ( <CustomButton onClick={this.signOut}>Sign out</CustomButton> )}
            </div>
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} style={{color: "#EB3349"}}>
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        
        {renderMobileMenu}
      </div>
    );

  }
}

export default withRouter(withStyles(styles)(NavBar));