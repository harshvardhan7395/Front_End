import React,{Component} from 'react';
import './list_restaurant.css';
import axios from '../utils/axios.js';
import Modal from 'react-modal';
import ModalDialog from './ModalDialog';
import MenuDetails from './MenuDetails';



class Listrest extends Component{
        constructor(props){
            super(props);
            this.state={
                restaurants:[],
                modelIsOpen:false,
                flag:true
            }
        }

        componentDidMount() {
            
            this.ServerGetRestaurant();

            //check if there is already a flag in local storage.
            var f=localStorage.getItem('flag'); 
            if(f==null)
              localStorage.setItem('flag',true);
            else{
            //convet the string value in localstorage to boolean.
              var flag;
              if(f==='false')
              flag=false;
              else
              flag=true;
              this.setState({flag:flag});

            }
           
            
        }
        //get the list of restaurants from the server and store it in state.
       ServerGetRestaurant = () => {
        axios.get('').then((response) =>{
            const {data} = response;
            this.setState({restaurants:data});
           
        }).catch(error => {
            console.log(error);
        })
       }

       //pass the id of restaurant and the flag state to the next component. 
        takeToRestaurantMenu = (id) => {
            console.log("restaurant menu");
            console.log("id:"+id);
            console.log(this.props);
            const {flag} = this.state;
             this.props.history.push(''+id+'/items/',{flag:flag});
        }

        //close the Modal of ModalDialog.
        handleModalClose = () =>{
            this.setState({modelIsOpen:false})
        }

        //delete the clicked restaurant.
        deleterestaurant = (id) => {

            axios.post(''+id+'/delete/')
            .then((response) => {
                    const rest = this.state.restaurants.filter((rest) => rest.id!=id);
                    console.log(rest);
                    this.setState({restaurants:rest});
            }).catch(error =>{
                console.log(error);
            })
           
        }


        //create an new reataurant with the accepted name and address.
        handleSubmit = (name,address) => {
           // console.log('In handleSubmit'+name+address);
           //make an api call to post name,address to server.
           const jobj ={
               name:name,
                add:address
           }
           axios.post('createnew/',jobj,{headers:{'Content-Type':'application/json'}})
           .then((response) =>{
               const {data} = response;
               this.ServerGetRestaurant();
               console.log(data);
               }).catch(error =>{
                   console.log(error);
               })
          
        }

        //check the flag state and change if necessary to true and store it in localstorage.
        Admin = () =>{
                const {flag} = this.state;
                if(flag==false){
                localStorage.clear();
                localStorage.setItem('flag',!flag);
                this.setState({flag:!flag});
                
            }
        }
        //check the falg state and change if necessary to false and store it in localstorage.
        User = () =>{
            const {flag} = this.state;
            if(flag==true){
            localStorage.clear();
            localStorage.setItem('flag',!flag); 
            this.setState({flag:!flag});
            }
            
        }

        //populate the cards with the name and address in the list.
        populate_rest = () => {
            const {restaurants} = this.state;
            return restaurants.map((rest) => {
                    return(
                        <div className="col-sm-3 rowpadd" key={rest.id}>
                            <div className="card inner">
                                <label>Name:</label>
                                {this.state.flag?
                                <button onClick={() =>{this.deleterestaurant(rest.id)}}className="btn btn-sm gly">delete</button>
                                :null}
                                <h5>{rest.name}</h5>
                                
                                <label>Address:</label>
                                <h5>{rest.address}</h5>
                                <button onClick={() => {this.takeToRestaurantMenu(rest.id)}} className="btn btn-warning">Menu</button>
                                {/* <MenuDetails flag={this.state.flag}/> */}
                            </div>
                        </div>
                    )
                })

        }

        render(){
            console.log("After set state: "+this.state.flag);
            return(
                <div className="container-fluid hea2">
                    <div className="container jumbotron head1">
                        <div className="col-sm-6">
                        <h3>Restaurant List</h3>
                        </div>
                    
                        <button onClick={() =>{this.Admin()}} className="btn btn-warning adm">Admin</button>
                        <button  onClick={() =>{this.User()}} className="btn btn-warning usr">User</button>
                        {this.state.flag?
                        <button onClick={() => {this.setState({modelIsOpen:true})}} className="btn btn-warning b">+ Add Restaurant</button>
                        :null}
                    </div>
                    <div className="row outerdiv">
                        {this.populate_rest()}
                    </div>
                    <ModalDialog isOpen={this.state.modelIsOpen} handleSubmit={this.handleSubmit} handleClose={this.handleModalClose} />
                </div>

            )
        }
}
export default Listrest;