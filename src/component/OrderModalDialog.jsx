import React,{Component} from 'react';
import Modal from'react-modal';

class OrderModalDialog extends Component{
    constructor(props){
        super(props);
    }


    populateOrder = () => {
        const items = this.props.items.filter((itm)=>!!itm.count);
        return(
            items.map((itm)=>{
                return(
                        <tr key={itm.id}>
                            <td>{itm.dish_name}</td>
                            <td>{itm.count}</td>
                            <td>{itm.price}</td>
                        </tr>

                   // <li className="list-group-item" >{itm.dish_name}&nbsp;&nbsp;<span>&nbsp;&nbsp;{itm.count}&nbsp;&nbsp;</span><span>&nbsp;&nbsp;{itm.price}</span></li>
        
                )
            })
        )
       
    }

    
    
    totalCost = () => {
        const items = this.props.items.filter((itm)=>!!itm.count);
        let total = 0;
        items.forEach(itm => {
           total=total+(itm.count*itm.price);
       });
       console.log(total);
       return total;
    // return <div className="container">{total}</div>
       
    }
   

    

    render(){
        return(
            
            <div className="container">
                <Modal isOpen={this.props.isOpen}>
                <div className="jumbotron ">
                <div className="container">    
                       <table className="table">
                           <thead>
                               <tr>
                               <th>Dish Name</th>
                               <th>Count</th>
                               <th>Price</th>
                               </tr>
                           </thead>
                           <tbody>
                        {this.populateOrder()}   
                        </tbody>
                        </table>
                    </div><br></br>
                    <div className="container">Toatal Amount:-{this.totalCost()}</div> 
                    {/* returns total cost to the call */}
                <br></br>
                <button onClick={this.props.isClose} className="btn btn-danger btn-sm">Close</button>
                <button onClick={() => {this.props.pay();this.props.isClose()}} className="btn btn-success btn-sm">PAY</button>
                </div>
                </Modal>
            </div>
        )
    }
}
export default OrderModalDialog;