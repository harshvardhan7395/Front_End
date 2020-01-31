import React,{Component} from 'react';
import axios from '../utils/axios.js';
import Modal from 'react-modal';
import ModalDialog from './ModalDialog';
import MenuDetails from './MenuDetails';
import { find } from 'lodash';
import Pagination from 'react-js-pagination';



class Listrest extends Component{
        constructor(props){
            super(props);
            this.state={
                restaurants:[],
                updatedrestaurant:[],
                modelIsOpen:false,
                flag:null,
                page:1,
            }
        }

        componentDidMount() {
            console.log(this.props);
            
            if(!this.props.history.location.state){

                this.ServerGetRestaurant(this.state.page);
               
            }else{
                
                const {page} = this.props.history.location.state;
                if(!JSON.parse(localStorage.getItem('rest_list'))){
                    this.ServerGetRestaurant(page);
                    }
                    else{
                    const rest = JSON.parse(localStorage.getItem('rest_list'));
                    console.log(rest);
                    const start = (page-1)*12;
                    const end = page*12;
                    const upd = rest.slice(start,end);
                    console.log("Afterslice in cdm");
                    console.log(upd);
                    this.setState({updatedrestaurant:upd});
                    this.setState({page:page});
                    this.setState({restaurants:rest})
                    
                    }
                //this.ServerGetRestaurant(page);
            }
            window.onbeforeunload = ()=>{
                this.props.history.replace();
            }
            

          
            //check if there is already a flag in local storage.
            var f=localStorage.getItem('flag'); 
            if(f==null){
              localStorage.setItem('flag',true);
             
            }
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
       ServerGetRestaurant = (page) => {
         
        axios.get('api?page='+page+'').then((response) =>{
            const {data} = response;
            console.log("Response Object : ");
            console.log(response);
            console.log(data);
            let {restaurants} = this.state;
            const updatedList = restaurants.concat(data);
            console.log("Rest List:\n");
            console.log(restaurants);
            localStorage.setItem('rest_list', JSON.stringify(updatedList));
            this.setState({updatedrestaurant:data});
            this.setState({page:page});
            this.setState({restaurants:updatedList});
           
        }).catch(error => {
          
            alert("Log in First");
            this.props.history.push('/');
        })
       }

       //pass the id of restaurant and the flag state to the next component. 
        takeToRestaurantMenu = (id) => {
            console.log("restaurant menu");
            console.log("id:"+id);
            console.log(this.props);
            const {flag} = this.state;
            const{page} = this.state;
            this.props.history.push('/'+id+'/items/',{flag:flag,page:page});
        }

        //close the Modal of ModalDialog.
        handleModalClose = () =>{
            this.setState({modelIsOpen:false})
        }

        //delete the clicked restaurant.
        deleterestaurant = (id) => {

            axios.post('api/'+id+'/delete/')
            .then((response) => {
                    const rest = this.state.restaurants.filter((rest) => rest.id!=id);
                    const upd = this.state.updatedrestaurant.filter((upd)=>upd.id!=id);
                    console.log(rest);
                    this.setState({updatedrestaurant:upd});
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
                address:address
           }
           axios.post('api/createnew/',jobj,{headers:{'Content-Type':'application/json'}})
           .then((response) =>{
                const {data} = response;
               const {restaurants} = this.state;
               const {updatedrestaurant} = this.state;
               const len = updatedrestaurant.length;
               if(len<12){
                   updatedrestaurant.push(data);
                   console.log(updatedrestaurant);

                   restaurants.push(data);
                    console.log(restaurants);
                   this.setState({restaurants:restaurants});
                   this.setState({updatedrestaurant:updatedrestaurant});
               }
               else{
                restaurants.push(data);
                const lst=updatedrestaurant.splice(0,len);
                lst.push(data);
                let {page} = this.state;
                page+=1;
                this.setState({page:page,restaurants:restaurants,updatedrestaurant:lst})
               }
               console.log(data);
               }).catch(error =>{
                   console.log(error);
               })
          
        }

        //check the flag state and change if necessary to true and store it in localstorage.
        logout = () =>{
               axios.post('users/logout/').then((response) =>{
                   alert(response.data);
                   localStorage.clear();
                    this.props.history.push('/');
                    const{data} = response
                    console.log(data);
               }).catch(error =>{
                   console.log(error);
               })
        }
        //check the falg state and change if necessary to false and store it in localstorage.
        OrderHistory = () =>{
            this.props.history.push('/orderhistory/');
            
        }

        handleNextPage = () =>{
            let {page} = this.state;
            page +=1;
            //console.log(page);
            //this.ServerGetRestaurant(page);
            const count = this.state.restaurants.length;
            console.log("count"+count);
            const max = (page-1)*12;
            if(count<=max){
                console.log("restlength<page*12");
                this.ServerGetRestaurant(page)
            }
            else{
                const {restaurants} = this.state;
                const lst = restaurants.slice((page-1)*12,page*12);
                this.setState({page:page});
                this.setState({updatedrestaurant:lst});
            }
        } 

        handlePreviousPage = () => {
            let {page} =this.state;
            let startCount,endCount;
            if((page-2)<1){
            startCount=0;
            }else{
                startCount=(page-2)*12;
            }
            endCount = (page-1)*12;
            let rest_list =JSON.parse(localStorage.getItem('rest_list'));
            
            let {restaurants} = this.state;
            const lis = rest_list.slice(startCount,endCount);
            page-=1;
            this.setState({page:page});
            this.setState({restaurants:rest_list});
            this.setState({updatedrestaurant:lis});
            
        }

        //populate the cards with the name and address in the list.
        populate_rest = () => {
            const {updatedrestaurant} = this.state;
            return updatedrestaurant.map((rest) => {
                    return(
                        <div className="  bg-white    w-1/5 mx-8 shadow-none hover:shadow-lg rounded-lg my-4  " key={rest.id}>
                            <div className="relative">
                            <img className=" rounded-lg " src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"/>
                            </div>
                               <div className="relative   bg-white rounded-lg ">
                                <h5 className=" text-gray-700 text-2xl font-medium font-mono ml-4 mb-1">{rest.name}</h5>
                                
                                <h5 className="text-gray-700 text-xl font-medium font-sans ml-4 mb-4">{rest.address}</h5>
                                <button onClick={() => {this.takeToRestaurantMenu(rest.id)}} className="text-white bg-orange-500 hover:bg-orange-700 rounded ml-4   p-2 ">Menu</button>

                                {this.state.flag?
                                <button onClick={() =>{this.deleterestaurant(rest.id)}}className="text-white bg-red-500 hover:bg-red-700 rounded p-2 ml-32  mb-4">delete</button>
                                :null}
                                </div>
                        </div>
                    )
                })

        }

        render(){
            console.log("After set state: "+this.state.flag);
            console.log(this.state.restaurants)
            const count = this.state.updatedrestaurant.length;
            console.log(this.state.updatedrestaurant);
            const f = this.state.updatedrestaurant;
            let fl=0;
            for( var i=0;i<count;i++){
                fl = f[i].nextpage;
                break;
            }
            console.log(fl);
            const {page} = this.state;

            return(
                <div className=" relative ">
                    <div className="flex relative z-10 sticky top-0">
                        <div className="flex-auto sm:flex-shrink relative bg-yellow-300 w-1/4 h-32 p-4">
                            <img className="h-24 flex-shrink  " src="data:image/jpeg;base64,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"/>
                        </div>
                        <div className="flex-auto sm:flex-shrink relative  bg-yellow-300 w-3/4  h-32 ">
                        {/* <h3 className=" font-bold text-black italic border-4 border-black font-serif ">Restaurant List</h3> */}
                        
                        <button  onClick={() =>{this.OrderHistory()}} className="bg-yellow-300 sm:flex-shrink hover:text-red-700  text-lg text-black font-bold mt-16 py-2 px-4 ml-24 border-black border-2 rounded-full ">OrderHistory</button>
                        
                        {this.state.flag?
                        <button onClick={() => {this.setState({modelIsOpen:true})}} className="bg-yellow-300 sm:flex-shrink hover:text-red-700  text-lg text-black font-bold mt-16 py-2 px-4 ml-24 border-black border-2 rounded-full ">+ Add Restaurant</button>
                        :null}
                        <button onClick={() =>{this.logout()}} className="bg-yellow-300 hover:text-red-700 sm:flex-shrink text-lg text-black font-bold mt-16 py-2 px-4  ml-24  border-black border-2 rounded-full">Logout</button>
                        
                        </div>
                    </div>
                        <div className=" flex flex-wrap bg-gray-100 p-4">
                        {this.populate_rest()}
                        </div>
                        <div className=" relative  bg-gray-100 text-center pb-8 ">
                                {this.state.page!=1?<button onClick={()=>{this. handlePreviousPage()}} className="bg-yellow-300 outline-none hover:text-yellow-700  text-lg text-black font-bold mt-16 py-2 px-2 rounded-full">Previous</button>:null}
                                <span className="text-black py-2 px-2 rounded font-medium text-xl ">&nbsp;&nbsp;&nbsp;{this.state.page}&nbsp;&nbsp;&nbsp;</span>
                                {fl?<button onClick={()=>{this.handleNextPage()}} className="bg-yellow-300 outline-none hover:text-yellow-700  text-lg text-black font-bold mt-16 py-2 px-4 rounded-full">Next</button>:null} 
                            <ModalDialog isOpen={this.state.modelIsOpen} handleSubmit={this.handleSubmit} handleClose={this.handleModalClose} />
                
                        </div>
                </div>
            )
        }
}
export default Listrest;