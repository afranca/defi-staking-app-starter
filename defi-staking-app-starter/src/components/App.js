import React, { Component } from 'react'
import Navbar from './Navbar'
import './App.css'
import Web3 from 'web3';

class App extends Component {

  // This is some sort of Setup() method, which runs
  // before aything gets rendered.
  async UNSAFE_componentWillMount() {
    //Load Metamask
    await this.loadWeb3()
    //Load Blockchain
    await this.loadBlockchainData()
  }

  // This is how you hook it up with Metamask (Provided by Metamask)
  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non ethereum browser detected. You should consider Metamask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    console.log(accounts)
    //this.setState({account: accounts[0]})
    //const networkId = await web3.eth.net.getId()  
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0'
    }
  }

  render() {
    return (
      
      <div  className="App" style={{ position: 'relative'}}>
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px', minHeight: '100vm'}}>
              <div>
                Hello World
              </div>
            </main>
        </div>
        </div>
      </div>
    );
  }
}

export default App;
