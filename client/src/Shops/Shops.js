import React, { Component } from 'react'
import axios from 'axios';
import Shop from './Shop';

export default class Shops extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          Shops: null,
        };
    }


    async componentDidMount(){
        const shops = this.props.favorite 
        ? 
        await this.getShops()
        : 
        (await axios.get('http://localhost:8081/shops')).data;

        this.setState({
            Shops: shops
        })
    }
    render() {
        const generatedShops = this.state.Shops ? this.state.Shops.map( shop => {
            return (
            <Shop
                name={shop.name}    
                icon={shop.icon}
                photoRef={shop.photo}
            >
            </Shop>
            )
        }) : "";

        return (
        <div>
            {
                generatedShops
            }
        </div>
        )
    }
}
