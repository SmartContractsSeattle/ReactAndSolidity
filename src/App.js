import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import contract from 'truffle-contract';
import ReactExample from './ReactExample.json';
import ipfs from './ipfs';

// This code was produced 20180605 by reading Zubair Ahmed's phenomenal tutorial series.
// Part 1:https://codeburst.io/react-ethereum-getting-started-with-the-minimum-toolset-required-part-1-of-4-8912326fd0de


class App extends Component {
	constructor (props) {
  	super (props);

		//set the contract address
	  this.state = {
			contractState: '',
			ipfsHash: ''
  	}

    this.querySecret = this.querySecret.bind (this);
    this.queryState = this.queryState.bind (this);
    this.handleContractStateSubmit = this.handleContractStateSubmit.bind (this);  //this line is inferred in the tutorial, but not explicit; w/o this line we get error: App.js:122 Uncaught TypeError: Cannot read property 'state' of undefined
    this.queryConditionResult = this.queryConditionResult.bind (this);
		this.activateExperiment = this.activateExperiment.bind (this);
		this.onUploadSubmit = this.onUploadSubmit.bind (this);
		this.captureFile = this.captureFile.bind (this);
		this.queryIpfsHash = this.queryIpfsHash.bind (this);
		
		let self = this;
		const exampleContract = contract(ReactExample);
		exampleContract.setProvider(window.web3.currentProvider);
		exampleContract.deployed().then(function(instance) {
			instance.getIpfsHash().then((hash, err) => {
				if (err) console.error ('Error fetching ipfsHash.', err);
				console.log("Initial ipfsHash: " + hash);
				self.setState({ipfsHash: hash});
			})
			self.state.ContractInstance = instance;
			self.state.event = self.state.ContractInstance.ExperimentComplete();
			self.state.event.watch ((err, event) => {
				if (err) console.error ('An error occurred...', err);
				console.log ('This is the event:', event);
				console.log ('This is the experiment result:', event.args.result);
			});
		});

  }

	//function calls
  querySecret () {
    const { getSecret } = this.state.ContractInstance;

    getSecret().then((secret, err) => {
      if (err) console.error ('An error occurred.', err);
      console.log ('This is our contract\'s secret variable value:', secret);
    })
  }


  queryState () {
    const { getState } = this.state.ContractInstance;

    getState().then((state, err) => {
      if (err) console.error ('An error occurred.', err);
      console.log ('Our SC\'s state variable value:', state);
    })
  }


  handleContractStateSubmit (event) {
    event.preventDefault ();

    const { setState } = this.state.ContractInstance;
    const { contractState: newState } = this.state;

    setState (
      newState,
      {
        gas: 300000,
        from: window.web3.eth.accounts[0],
        value: window.web3.toWei (0.01, 'ether')
      }).then((result, err) => {
        console.log ('Smart contract\'s state is changing. Waiting on the blockchain.');
      }
    )
  }


  queryConditionResult () {
    const { pseudoRandomResult } = this.state.ContractInstance;

    pseudoRandomResult().then((result, err) => {
      console.log ('This is the smart contract conditional:',result);
    })
  }


  activateExperiment () {
    const { setExperimentInMotion } = this.state.ContractInstance;

    setExperimentInMotion({
      gas: 300000,
      from: window.web3.eth.accounts[0],
      value: window.web3.toWei (0.01,'ether')
    }).then((result, err) => {
      console.log ('Experiment to determine true or false set in motion.');
    })
	}

	queryIpfsHash () {
		const { getIpfsHash } = this.state.ContractInstance;

    getIpfsHash().then((state, err) => {
      if (err) console.error ('An error occurred.', err);
      console.log ('Our SC\'s stored ipfHash:', state);
    })
	}
	
	onUploadSubmit (event) {
		event.preventDefault()
    ipfs.files.add(this.state.buffer, (error, result) => {
      if(error) {
        console.error(error)
        return
      }
      this.state.ContractInstance.setIpfsHash(result[0].hash, { from: window.web3.eth.accounts[0] }).then((r) => {
				console.log('ifpsHash', result[0].hash)
        return this.setState({ ipfsHash: result[0].hash })
      })
    })
	}

	captureFile (event) {
		event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
    }
	}

	render() {
		return (
			<div className='App'>
				<header className="App-header">
					<img src={ logo } className="App-logo" alt="logo" />
					<h1 className="App-title"> React & Ethereum Simple Application </h1>
				</header>
				<br />
				<br />
				<button onClick={ this.querySecret }> Call the getSecret function </button>
				<br />
				<br />
				<button onClick={ this.queryState }> Call the getState function </button>
				<br />
				<br />
				<form onSubmit={ this.handleContractStateSubmit }>
					<input
						type="text"
						name="state-change"
						placeholder="Enter new state..."
						value={ this.state.contractState }
						onChange={ event => this.setState ({ contractState: event.target.value})} />
					<button type="submit"> Submit </button>
				</form>
				<br />
				<br />
				<button onClick={ this.queryConditionResult }> Query Smart Contract Conditional Result </button>
				<br />
				<br />
				<button onClick={ this.activateExperiment }> Start Experiment on Smart Contract </button>
				<br />
				<br />
				<form onSubmit={ this.onUploadSubmit }>
					<input type='file' onChange={ this.captureFile } />
					<button type='submit'> Upload </button>
				</form>
				<br />
				<br />
				<button onClick={ this.queryIpfsHash }> Call the getIpfsHash function </button>
				<br />
				<br />
				<h1>IPFS Image</h1>
				<img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>
			</div>
		);
  }
}

export default App;
