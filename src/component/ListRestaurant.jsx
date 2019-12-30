import React,{Component} from 'react';
import './list_restaurant.css';
import axios from './../utils/axios';

class ListRestaurant extends Component{
    constructor(props){
        super(props);
        this.state = {
            name : "",
            address : "",
            restaurantList : []
        }
    }
    componentDidMount() {
        axios.get('').then(({data}) => {
            this.setState({restaurantList : data});
        }).catch(error => {
            console.log(error);
        })
    }
    renderRestaurants = () => {
        const {restaurantList} = this.state;
        return restaurantList.map((restaurant) => {
            return(
                <div className="col-sm-3 " key={restaurant.id}>
                    <div className="card inner">
                        <label>Restaurant Name:</label>
                        <h5>{restaurant.name}</h5>
                        <br></br>
                        <label>Address:</label>
                        <h5>{restaurant.address}</h5>
                        <button className="btn btn-warning">Menu</button>
                    </div>
                </div>
            )
        })
    }
    render(){
        const {restaurantList} = this.state;
        console.log(restaurantList);
        return(
        <div className="container">
           <div className="head1"> <h3>Restaurant List</h3></div>
            <div className="row outerdiv">
                {this.renderRestaurants()}
                
            </div>
        </div>
            
        )}
}
export default ListRestaurant; 