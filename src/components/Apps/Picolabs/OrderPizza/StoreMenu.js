import React from 'react';
import './OrderPizzaApp.css';
import ItemModal from './ItemModal';
import spinner from './PizzaLoader.GIF';
import {amount} from './toppings';
import classnames from 'classnames';
import slice1 from './PizzaSlice1.png';
import slice2 from './PizzaSlice2.png';
import slice3 from './PizzaSlice3.png';
import slice4 from './PizzaSlice4.png';
import slice5 from './PizzaSlice5.png';
import slice6 from './PizzaSlice6.png';
import slice7 from './PizzaSlice7.png';
import fullpizza from './fullpizza.png';
import onelesslice from './onelesslice.png'
import twolesslice from './twolesslice.png'
import {Collapse, Button, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter, TabContent, TabPane, Nav, NavItem, NavLink, Media} from 'reactstrap';

class StoreMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      StoreID: null,
      StoreAddress: null,
      StoreMenu: {},
      StoreVariants: {},
      StoreDescription: {},
      ProductMap: {},
      toppingsMap: {},
      reverseMap: {},
      toppingTags: {},
      cardCollapse: false,
      cart: [],
      activeTab: '1',
      loading: true,
      title: "",
      description: "",
      formComplete: null,
      formError: null
    }
    this.toggle = this.toggle.bind(this);
    this.toggleCart = this.toggleCart.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
    this.toggleCardCollapse = this.toggleCardCollapse.bind(this);
    this.getCart = this.getCart.bind(this);
    this.toggleCartToppings = this.toggleCartToppings.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.onClickRemove = this.onClickRemove.bind(this);
    this.validateOrder = this.validateOrder.bind(this);
    this.getToppingsMap = this.getToppingsMap.bind(this);
    this.changeQty = this.changeQty.bind(this);
  }

  onChange(stateKey) {
    return (event) => {
      let value = event.target.value
      this.setState({
        [stateKey]: value
      })
    }
  }

  toggleCart() {
    this.setState(prevState => ({
      modal: !prevState.modal,
      cardCollapse: false
    }));
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  toggleCardCollapse() {
    this.setState(state => ({ cardCollapse: !state.cardCollapse }));
  }

  toggle(e) {
    var t = e.target.textContent;
    this.setState({ [t]: !this.state[t]});
  }

  toggleCartToppings(e) {
    var t = e.target.id;
    this.setState({ [t]: !this.state[t] });
  }

  componentDidMount() {
    this.getStoreID();
    this.getToppingsMap();
    this.getStoreAddress();
    this.getStoreMenu();
    this.getStoreVariants();
    this.getDescription();
    this.getCart();
    for( var item in this.state.StoreMenu)
    {
      this.setState({
        [item]: false
      })
    }
    setTimeout(() => {
      this.setState({
        loading: false
      })
    }, 3000)
  }

  componentWillUnmount() {
    // this.props.signalEvent({
    //   domain : "echo",
    //   type: "clear",
    //   attrs : {}
    // });
  }

  myFunction() {
    this.setState({
      loading: false
    });
  }

  getToppingsMap() {
    const promise = this.props.manifoldQuery({
      rid: "io.picolabs.pizza",
      funcName: "getToppingsMap"
    });
    promise.then((resp) => {
      this.setState({
          toppingsMap: resp.data["toppings"],
          reverseMap: resp.data["reverse"],
          toppingTags: resp.data["tags"]
      })
    }).catch((e) => {
      console.error("Error getting toppings", e);
    });
  }

  getOrderDescription() {
    const promise = this.props.manifoldQuery({
      rid: "io.picolabs.pizza",
      funcName: "getOrderDescription"
    });
    promise.then((resp) => {
      this.setState({
          title: resp.data['title'],
          description: resp.data['description']
      });
    });
  }

  getStoreID() {
    const promise = this.props.manifoldQuery({
      rid: "io.picolabs.pizza",
      funcName: "getStoreID"
    });
    promise.then((resp) => {
      this.setState({
          StoreID: resp.data
      })
    }).catch((e) => {
      console.error("Error getting StoreID", e);
    });
}

getStoreAddress() {
  const promise = this.props.manifoldQuery({
    rid: "io.picolabs.pizza",
    funcName: "getStoreAddress"
  });
  promise.then((resp) => {
    this.setState({
        StoreAddress: resp.data
    })
  }).catch((e) => {
    console.error("Error getting StoreAddress", e);
  });
}

getStoreMenu() {
  const promise = this.props.manifoldQuery({
    rid: "io.picolabs.pizza",
    funcName: "getMenu"
  });
  promise.then((resp) => {
    this.setState({
        StoreMenu: resp.data
    })
  }).catch((e) => {
    console.error("Error getting StoreMenu", e);
  });
}

getStoreVariants() {
  const promise = this.props.manifoldQuery({
    rid: "io.picolabs.pizza",
    funcName: "getVariants"
  });
  promise.then((resp) => {
    this.setState({
        StoreVariants: resp.data
    })
  }).catch((e) => {
    console.error("Error getting StoreVariants", e);
  });
}

getDescription() {
  const promise = this.props.manifoldQuery({
    rid: "io.picolabs.pizza",
    funcName: "getDescription"
  });
  promise.then((resp) => {
    this.setState({
        StoreDescription: resp.data
    })
  }).catch((e) => {
    console.error("Error getting Descriptions", e);
  });
}

getCart() {
  const promise = this.props.manifoldQuery({
    rid: "io.picolabs.pizza",
    funcName: "getProductCart"
  });
  promise.then((resp) => {
    this.setState({
        cart: resp.data
    });
    for(var item in resp.data) {
      this.setState({
        [resp.data[item]['Code']]: false
      })
    }
    this.getOrderDescription();
  }).catch((e) => {
    console.error("Error getting Descriptions", e);
  });
}

displayMenu() {
  var array = [];
  var count = 1;
  for( var item in this.state.StoreMenu) {
    let temp = count.toString();
    array.push(
      <NavItem key={item}>
            <NavLink
              className={classnames({ active: this.state.activeTab === temp})}
              onClick={() => {
                this.toggleTab(temp)}}>
                {item}
            </NavLink>
        </NavItem>
    );
    ++count;
  }


  return array;
}

displayMenuItems() {
  var array = [];
  var count = 1;
  for( var item in this.state.StoreMenu) {
    let temp = count.toString();
    array.push(
      <TabPane key={"The body of ".concat(item)} tabId={temp} style={{"min-height": "750px"}}>
        {item === "Breads" && <Media object src={slice1} style={{"float": "right", "width": "750px", "height": "750px"}}></Media>}
        {item === "Build Your Own" && <Media object src={slice2} style={{"float": "right", "width": "750px", "height": "750px"}}></Media>}
        {item === "Chicken" &&  <Media object src={slice3} style={{"float": "right", "width": "750px", "height": "750px"}}></Media>}
        {item === "Desserts" &&  <Media object src={slice4} style={{"float": "right", "width": "750px", "height": "750px"}}></Media>}
        {item === "Drinks" && <Media object src={slice5} style={{"float": "right", "width": "750px", "height": "750px"}}></Media>}
        {item === "Extras" && <Media object src={slice6} style={{"float": "right", "width": "750px", "height": "750px"}}></Media>}
        {item === "Pasta" && <Media object src={slice7} style={{"float": "right", "width": "750px", "height": "750px"}}></Media>}
        {item === "Salads" && <Media object src={fullpizza} style={{"float": "right", "width": "750px", "height": "750px"}}></Media>}
        {item === "Sandwiches" && <Media object src={onelesslice} style={{"float": "right", "width": "750px", "height": "750px"}}></Media>}
        {item === "Specialty Pizzas" && <Media object src={twolesslice} style={{"float": "right", "width": "750px", "height": "750px"}}></Media>}
        {this.findVariants(this.state.StoreMenu[item])}
      </TabPane>
    );
    count++;
  }
  return array;
}

findVariants(array, code) {
  var out = [];
  for(var item in array) {
    var avToppings = this.state.StoreDescription[array[item]];
    var toppings;
    if(avToppings == null) {
      toppings = "";
    }
    else {
      toppings = avToppings.AvailableToppings;
    }
    for(var product in this.state.StoreVariants) {
      if(this.state.StoreVariants[product]["ProductCode"] === array[item]) {
        out.push(
            <FormGroup style={{"width": "500px"}} key={this.state.StoreVariants[product]["Code"]} tag="fieldset">
            <FormGroup check>
              <Label check>
                {this.state.StoreVariants[product]["Name"]}
                <ItemModal
                  signalEvent={this.props.signalEvent}
                  buttonLabel='Order'
                  title={this.state.StoreVariants[product]["Name"]}
                  price={this.state.StoreVariants[product]["Price"]}
                  code={this.state.StoreVariants[product]["Code"]}
                  availableToppings={toppings}
                  defaultToppings={this.state.StoreVariants[product]["Tags"]["DefaultToppings"]}
                  getCart = {this.getCart}
                  toppings = {this.state.toppingsMap}
                  toppingsFlipped = {this.state.reverseMap}
                  toppingTags = {this.state.toppingTags}
                />
              </Label>
            </FormGroup>
            </FormGroup>
        );
      }
    }
  }
  return out;
}

cart() {
  return (
    <FormGroup tag="fieldset">
    <FormGroup check>
      <Label check>
      <div>
        <Button color="primary" className="cartButton" size="sm" onClick={this.toggleCart}>Cart</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggleCart} className={this.props.className}>
          <ModalHeader toggle={this.toggleCart}>Your Products</ModalHeader>
            <ModalBody>
              {this.listCartItems()}
                Order Title:
                <input type="text" name="title" style={{margin: 5}} ref={input => this._title = input} placeholder={this.state.title}/>
                <div>
                Description:
                <input type="textarea" name="description" style={{margin: 5}} ref={input => this._description = input} placeholder={this.state.description}/>
                </div>
                Payment option:
                <FormGroup check>
                  <Label check>
                    <Input type="radio" name="radio1" id="cash" onChange={()=>{if(this.state.cardCollapse)this.toggleCardCollapse()}}/>{' '}
                    Cash or pay at store
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input type="radio" name="radio1" onChange={this.toggleCardCollapse}/>{' '}
                    Card
                  </Label>
                </FormGroup>
                <Collapse isOpen={this.state.cardCollapse}>
                  Card Number:
                  <input type="text" name="card_number" style={{margin: 5}} ref={input => this._card_number = input}/>
                  <div>
                    Card Expiration:
                    <input type="text" name="expiration" style={{margin: 5}} ref={input => this._expiration = input}/> {'Ex: 06/19'}
                  </div>
                  <div>
                    Security Code:
                    <input type="text" name="security_code" style={{margin: 5}} ref={input => this._security_code = input}/>
                  </div>
                  <div>
                    Postal Code:
                    <input type="text" name="postal_code" style={{margin: 5}} ref={input => this._postal_code = input}/>
                  </div>
                </Collapse>
                {this.state.formComplete === false && <div style={{ 'color': 'red'}}>* Please fill all fields </div>}
                {this.state.formError && <div style={{ 'color': 'red'}}>* Error: please check all fields </div>}
            </ModalBody>
          <ModalFooter>
            {this.state.cart.length > 0 ? <Button color="primary" className="genericButton" onClick={this.validateOrder}>Submit</Button> : <Button color="primary" className="genericButton" disabled onClick={this.validateOrder}>Submit</Button>} {' '}
            <Button color="secondary" className="genericButton" onClick={this.toggleCart}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <FormGroup>
        </FormGroup>
      </div>
      </Label>
    </FormGroup>
    </FormGroup>
  );
}

validateOrder() {
  if(this.state.cardCollapse === true) {
    if(this._card_number.value !== "" && this._expiration.value !== "" && this._postal_code.value !== ""
      && this._security_code.value !== "") {
        let first_promise = this.props.signalEvent({
          domain : "add",
          type: "card",
          attrs : {
            number: this._card_number.value,
            expiration: this._expiration.value,
            postal_code: this._postal_code.value,
            security_code: this._security_code.value,
          }
        });
        first_promise.then((resp) => {
          console.log(resp.data.directives);
          if(resp.data.directives.length === 0 || resp.data.directives[0]['name'] !== "No Type Found") {
            var t = (this._title.value !== "") ? this._title.value : this.state.title;
            var d = (this._description.value !== "") ? this._description.value : this.state.description;
            let second_promise = this.props.signalEvent({
              domain : "create",
              type: "order",
              attrs : {
                title: t,
                description: d
              }
            })
            second_promise.then(() => {
              this.props.displaySwitch('Locator');
            })
          } else {
            this.setState({
              formError: true,
              formComplete: true
            });
          }
        })
    } else {
      this.setState({
        formComplete: false
      });
    }
  } else {
      var t = (this._title.value !== "") ? this._title.value : this.state.title;
      var d = (this._description.value !== "") ? this._description.value : this.state.description;
      let promise = this.props.signalEvent({
        domain : "create",
        type: "order",
        attrs : {
          title: t,
          description: d
        }
      })

      promise.then(() => {
        this.props.displaySwitch('Locator');
      })
  }
}

cartItemToppings(toppings) {
  var out = [];

  for (var topping in toppings) {
    for(var amounts in toppings[topping]) {
    out.push(
      <div key={this.state.toppingsMap[topping].concat(amount[toppings[topping][amounts]])}>
        {this.state.toppingsMap[topping]} {' '}
        Amount: {amount[toppings[topping][amounts]]}
      </div>
    );
  }
}
  return out;
}

listCartItems() {
  var out = [];

  for(var item in this.state.cart)
  {
    if(this.state.StoreVariants !== undefined  && this.state.cart[item] !== null && this.state.StoreVariants[this.state.cart[item]['Code']] !== undefined) {
      var compare = JSON.parse(JSON.stringify(this.state.cart[item]['Options']));
      var id = this.state.cart[item]['Code'].concat(JSON.stringify(this.state.cart[item]['Options']));
      var value = JSON.stringify(this.state.cart[item]['Options']);
      var qty = this.state.cart[item]['Qty'].toString();
      out.push(
        <div key={id}>
          {this.state.StoreVariants[this.state.cart[item]['Code']]['Name']} {' '}
          Qty:
          <Input style={{width:50, display:"inline"}} type="select" bsSize="sm" name="Quantity" id={JSON.stringify(this.state.cart[item])} className="select" onChange={this.changeQty}>
            <option selected={qty=== '1' ? 'selected' : ""}>1</option>
            <option selected={qty === '2' ? 'selected' : ""}>2</option>
            <option selected={qty === '3' ? 'selected' : ""}>3</option>
            <option selected={qty === '4' ? 'selected' : ""}>4</option>
            <option selected={qty === '5' ? 'selected' : ""}>5</option>
            <option selected={qty === '6' ? 'selected' : ""}>6</option>
            <option selected={qty === '7' ? 'selected' : ""}>7</option>
            <option selected={qty === '8' ? 'selected' : ""}>8</option>
            <option selected={qty === '9' ? 'selected' : ""}>9</option>
            <option selected={qty === '10' ? 'selected' : ""}>10</option>
          </Input>
          {compare === '{}' ? "" : <button className='danger' id={id} value={value} onClick={this.toggleCartToppings}>
            {' '} Toppings
          </button>}
          <button className='danger' id={this.state.cart[item]['Code']} value={value} onClick={this.onClickRemove}>
            {' '} Remove
          </button>
          <Collapse isOpen={this.state[id]}>
              {this.cartItemToppings(this.state.cart[item]['Options'])}
          </Collapse>
        </div>
      );
    }
  }

  return out;
}

changeQty(e) {
  var item = e.target.id;
  var qty = e.target.value;

  var promise = this.props.signalEvent({
    domain : "change",
    type: "qty",
    attrs : {
      item: item,
      qty: qty
    }
  });

  promise.then((resp) => {
    this.getCart();
  });
}

onClickRemove(e) {
  var code = e.target.id;
  var toppings = e.target.value;

  this.removeItem(code, toppings);
}


removeItem(code, toppings) {
  this.props.signalEvent({
    domain : "remove",
    type: "Item",
    attrs : {
      code: code,
      toppings: toppings
    }
  })
  this.getCart();
}

render() {
    if(this.state.loading === true) {
      return (
        <div>
          <Media object src={spinner}></Media>
        </div>
      );
    } else {
      return (
        <div>
            <div>
              Nearest Store Address: {' '}
              {this.state.StoreAddress}
            </div>
            <div style={{float:'right'}}>
              {this.cart()}
            </div>
            <div>
              <Nav tabs>
                {this.displayMenu()}
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                {this.displayMenuItems()}
              </TabContent>
            </div>
        </div>
      );
    }
  }
}

export default StoreMenu;
