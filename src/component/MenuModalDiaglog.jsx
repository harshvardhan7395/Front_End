import React,{Component} from 'react';
import Modal from 'react-modal';

class MenuModalDialog extends Component{
    constructor(props){
        super(props);
        this.state={
            dish_name:'',
            price:''
        }
    }


    dish = (event) => {
        this.setState({dish_name:event.target.value});
    }

    pri = (event) => {
        this.setState({price:event.target.value});
    }

    Submit = () => {
        this.props.AddItm(this.state.dish_name,this.state.price);
        this.setState({dish_name:'',price:''});
        this.props.isClose();
    }


    render(){
        return(
            <div className="container">
            <Modal isOpen={this.props.isOpen}
            contentLabel="Add Items"
            >
            <div className="jumbotron">
                <div className="container-fluid ">
                    <h3>Add Items</h3>

                    <div role="form row">
                    <div className="col-sm-6 col-sm-offset-4">
                        <label>Item Name </label>
                        <input type="text" onChange={this.dish} className="form-control" value={this.state.dish_name}/><br></br>
                
    
                        <label>Price </label>
                        <input type="text" onChange={this.pri} className="form-control" value={this.state.price}/><br></br>

                        
                        <button onClick={this.Submit} className="btn btn-success col-sm-3">Add Items </button>

                        <button onClick={this.props.isClose} className="btn btn-danger col-sm-offset-6">Close </button>
            
                    </div>
                    </div>
                </div>
            </div>
            </Modal>
        </div>
        )
    }
}
export default MenuModalDialog;