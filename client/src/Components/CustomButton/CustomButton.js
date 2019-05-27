import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    color: "#EB3349"
  },
  input: {
    display: 'none',
  },
});

function CustomButton(props) {
  const { classes, ...rest } = props;
  return (
      <Button className={classes.button} {...rest}>
        {props.children}
      </Button>
  );
}

CustomButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomButton);