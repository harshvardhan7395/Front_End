import React,{Component} from 'react';
import axios from '../utils/axios.js';
import './MenuDetails.css';
import MenuModalDialog from './MenuModalDiaglog.jsx';
import OrderModalDialog from './OrderModalDialog.jsx';


class MenuDetails extends Component{
    constructor(props){
        super(props);
        this.state = {
            name:'',
            address:'',
            items:[],
            modalState:false,
            ordermodal:false
            
        }
    }

    componentDidMount(){
        this.ServerGetItems();
    }

    //close the MenuModalDialog and OrderModalDialog.
    handleClose = () => {
        this.setState({modalState:false});
        this.setState({ordermodal:false});
    }

    //get the list of reataurants from the server.
    ServerGetItems = () => {
        axios.get(''+this.props.match.params.id+'/items/')
        .then((response) => {
            const {data} = response;
            console.log(this.props);
            this.setState({
                name:data.name,
                address:data.address,
                items:data.items, 
                    
            });
           console.log('After:'+this.state.name); 
        }).catch((error) => {
            console.log(error);
        } )
    }

    //delete item from the list of items.
    deleteItems = (itmid) => {
        const restid = this.props.match.params.id;
        axios.post(''+restid+'/items/'+itmid+'/delete/')
        .then((response) => {
            const {data} = response;
            console.log(data);
            const items = this.state.items.filter((itm) =>itm.id!=itmid);
            this.setState({items:items});
        })
    }

    //Add item to a particular restaurant.
    AddItm = (dish,price) => {
       // console.log(dish+price);
       const jobj ={
           name1:dish,
           price:price
       }
       axios.post(''+this.props.match.params.id+'/createnewitems/',jobj,{headers:{'Content-Type':'application/json'}})
       .then((response) => {
           const {data} = response;
           this.ServerGetItems();
            console.log(data);
        }).catch(error => {
            console.log(error);
        })
    }

    //increase the count of the item.
    incrementcount = (itmsid) => {
        //null or undefined
        //key -> value?
        //key -> null value.
        const {items} = this.state;
        const itm = items.filter((itm) => itm.id==itmsid);
        //itm is initialized by pass by referenced.
        //filter and map returns an array.
        console.log(Array.from(itm));
        //update this item?
        // get the current count.
        // increment by one.
        //update item count.
        //set new item in the array
        //set state
        let {count} = itm[0];   
        //initializing the count variable for the given item and assigning it undefined. 
        if (!count) count = 0;
        //since count is undefined so !count is true for first click and it gets initialized to zero.
        count += 1;
        itm[0].count = count;
        //count is incremented in the state.
        this.setState({items:items});
        
    }

    //place the order of the selected items in the restaurant.
    placeOrder = () => {
        const {items} = this.state;
        const itms = items.filter((itm) => !!itm.count);
        
        
        const jobj=itms.map((itm)=> {
        const obj={
                id:itm.id,
                count:itm.count
            }
            return obj;
        })

        axios.post(''+this.props.match.params.id+'/createorder/',jobj,{headers:{'Content-Type':'application/json'}})
       .then((response) => {
           const {data} = response;
           const {items} = this.state;
            this.setState({id:data});
            this.ServerGetItems();
           console.log(data);
       }).catch(error =>{
           console.log(error);
       })
    }

    //decrement the count of the items.
    decrementcount = (itmsid) =>{
        const {items} = this.state;
        const itm = items.filter((itm) => itm.id==itmsid);
        let count=itm[0].count;
        count--;
        itm[0].count=count;
        this.setState({items:items});
    }

    //populate the list of items for the particular restaurant.
    populate_items = () => {
            const{items} = this.state;
            return items.map((itms) => {
                return(
                    <div className="col-sm-4 list" key={itms.id}>
                        <div className="card inner1">
                        <label>{itms.dish_name}</label>
                       
                        <br></br>
                        <label>{itms.price}</label>
                        
                        {itms.count > 0 ?
                        <div><button onClick={()=>{this.decrementcount(itms.id)}} className="btn btn-danger btn-sm">-</button><span>&nbsp;{itms.count}&nbsp;</span><button onClick={()=>{this.incrementcount(itms.id)}} className="btn btn-success btn-sm">+</button>
                         </div>:
                        <button onClick={()=>{this.incrementcount(itms.id)}} className="btn btn-warning col-sm-3 bt">Add</button>
                        }
                       
                        {this.props.history.location.state.flag?<button onClick={() => {this.deleteItems(itms.id)}} className="btn btn-sm glyc">Delete</button>
                        :null}
                        </div>
                    </div>
                )
            })
    }

    //calculate the total cost of the selected items.
    totalCost = () => {
        const items = this.props.items.filter((itm)=>!!itm.count);
        const total=items.forEach(itm => {
           total=total+(itm.count*itm.price);
       });
       console.log(total);
       return total;
    // return <div className="container">{total}</div>
       
    }
   

    render(){
        const{name,address} = this.state;
        return(
                <div className="conatiner">
                    <div className="container jumbotron head">
                        <div className="col-sm-6  ">
                            <h3>Restaurant Name:    {name}</h3>
                            <h4>Address:    {address}</h4>
                        </div>
                        {this.props.history.location.state.flag?<button onClick={() => {this.setState({modalState:true})}} className="btn btn-warning b">+ Add Items</button>
                    :null}
                        </div>
                    <div className="container">
                        <div className="container row outerdiv">
                            {this.populate_items()}

                        </div>
                        <MenuModalDialog isOpen={this.state.modalState} isClose={this.handleClose} AddItm={this.AddItm} />
                    </div>

                    <button onClick={() => {this.setState({ordermodal:true})}} className="btn btn-success btn-sm ord">ORDER NOW</button>
                    <OrderModalDialog isOpen={this.state.ordermodal} items={this.state.items} pay={this.placeOrder} isClose={this.handleClose}/>
                    </div>
        )
    }
}
export default MenuDetails;