import React, { Component } from 'react';
import {createThing,removeThing,updateThing} from '../../utils/manifoldSDK';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import Thing from './Thing';



const ResponsiveReactGridLayout = WidthProvider(Responsive);

const brandPrimary =  '#20a8d8';
const brandSuccess =  '#4dbd74';
const brandInfo =     '#63c2de';
const brandDanger =   '#f86c6b';

class MyThings extends Component {
  constructor(props) {
    super(props);
    console.log("THE PROPS!!!!",props);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.state = {
      addModal: false,
      removeModal: false,
      name: "",
      nameToDelete: ""
    }
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggleRemoveModal = this.toggleRemoveModal.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
  }

  toggleAddModal() {
    this.setState({
      addModal: !this.state.addModal,
      name: "" // this will reset the name when you navigate away from the add thing modal
    });
  }

  toggleRemoveModal(){
    this.setState({
      removeModal: !this.state.removeModal,
      nameToDelete: ""
    });
  }

  handleAddClick(){
    const newName = this.state.name;
    this.toggleAddModal();
    this.props.dispatch({type: "command", command: createThing, params: [newName]});
  }
  handleRemoveClick(){
    const nameToDelete = this.state.nameToDelete;
    this.toggleRemoveModal();
    this.props.dispatch({type: "command", command: removeThing, params: [nameToDelete]});
  }
  handleUpdateClick(){
    updateThing("ThingsName",{});
  }

  onLayoutChange(layout) {
    //this.props.onLayoutChange(layout);
    this.setState({layout: layout});
  }

  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  }

  createElement(el) {
    return (
      <div key={el.key} data-grid={el} >
          <Thing name={el.name} id={el.id} parent_eci={el.parent_eci} eci={el.eci}/>
      </div>
    );
  }

  render(){
    return (
      <div>
        <div style={{height:"30px"}}>
          <button style={{float:"right"}} className="btn btn-primary" onClick={() => this.toggleAddModal()}>+</button>
          <button style={{float:"right"}} className="btn btn-danger" onClick={() => this.toggleRemoveModal()}>-</button>
          <button style={{float:"right"}} className="btn btn-warning" onClick={() => this.handleUpdateClick()}>^</button>
        </div>
        <Modal isOpen={this.state.addModal} toggle={this.toggleAddModal} className={'modal-primary'}>
          <ModalHeader toggle={this.toggleAddModal}>Create a new Thing</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label> New Thing's name</label>
              <input type="text" className="form-control" id="name" placeholder="Lord Sauron" onChange={(element) => this.setState({ name: element.target.value})}/>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleAddClick}>Create Thing</Button>{' '}
            <Button color="secondary" onClick={this.toggleAddModal}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.removeModal} toggle={this.toggleRemoveModal} className={'modal-primary'}>
          <ModalHeader toggle={this.toggleRemoveModal}>Delete a Thing</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label> Thing's name you wish to delete</label>
              <input type="text" className="form-control" id="name" placeholder="Lord Sauron" onChange={(element) => this.setState({ nameToDelete: element.target.value})}/>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleRemoveClick}>Delete Thing</Button>{' '}
            <Button color="secondary" onClick={this.toggleRemoveModal}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <div>
          <ResponsiveReactGridLayout {...this.props} onLayoutChange={this.onLayoutChange}
            onBreakpointChange={this.onBreakpointChange}>

            {_.map(this.props.things,this.createElement)}

          </ResponsiveReactGridLayout>
        </div>
      </div>
    );
  }
}

MyThings.defaultProps = {
  className: "layout",
  cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
  rowHeight: 100
};

function addPropsToThings(thingsArray){
  return thingsArray.map(function(i, key, list) {
    return {key: key.toString(), x: key * 2, y: 0, w: 3, h: 2, name: i.name, id: i.id, eci: i.eci, parent_eci: i.parent_eci};
  })
};

const mapStateToProps = state => {
  if(state.manifoldInfo.things){
    return {
      things: addPropsToThings(state.manifoldInfo.things.things.children)
    }
  }else{
    return {}
  }
}

export function deletePico(){
  this.toggleRemoveModal();
}

export default connect(mapStateToProps)(MyThings);
