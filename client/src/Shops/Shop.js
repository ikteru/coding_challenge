import React, { Component } from 'react'

export default class Shop extends Component {
  render() {
    return (
      <div>
        <h1>
            { this.props.name}
        </h1>
        <p>
            <img src={this.props.icon} alt=""/>
        </p>
      </div>
    )
  }
}
