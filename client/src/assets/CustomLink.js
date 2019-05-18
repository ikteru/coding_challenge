import React from 'react';
import { Link } from 'react-router-dom';

const CustomLink = props => {
    const CustomLinkStyle = {
      textDecoration: "none"
    };
    return <Link {...props} style={CustomLinkStyle} />;
  };

  export default CustomLink