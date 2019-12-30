import React,{Component} from 'react';
import Modal from 'react-modal';


class ModalDialog extends Component{
    constructor(props){
        super(props);
           this.state={ name:'',
            address:'',
           
        }
    }

    Rname = (event) => {
        console.log(event.target.value);    
        this.setState({name:event.target.value});
    }

    Radd = (event) => {
        console.log(event.target.value);
        this.setState({address:event.target.value});
    }

    Submit = () => {
        this.props.handleSubmit(this.state.name,this.state.address);
        this.setState({name:'',address:''});
        this.props.handleClose();
    }
   


    render(){
        console.log(this.props.isOpen);
        return(
            <div className="container">
                <Modal isOpen={this.props.isOpen}
                contentLabel="Add Restaurant"
                >
                <div className="jumbotron">
                    <div className="container-fluid ">
                        <h3>Add Restaurant</h3>

                        <div role="form row">
                        <div className="col-sm-6 col-sm-offset-4">
					        <label>Restaurant Name </label>
					        <input type="text" onChange={this.Rname} className="form-control" value={this.state.name}/><br></br>
					
		
					        <label>Address </label>
				        	<input type="text" onChange={this.Radd} className="form-control" value={this.state.address}/><br></br>

                            
                            <button onClick={this.Submit} className="btn btn-success col-sm-3">Add Restaurant </button>

                            <button onClick={this.props.handleClose} className="btn btn-danger col-sm-offset-6">Close </button>
                
						</div>
                        </div>
                    </div>
                </div>
                </Modal>
            </div>
        )
    }
}
export default ModalDialog;