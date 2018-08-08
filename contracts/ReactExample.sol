pragma solidity ^0.4.11;

contract ReactExample {

    //STATE VARIABLES//
    address private owner;  //declare a private state variable 'owner' of the address type
    string public you_awesome;  //declare a public state variable 'you_awesome' of the string type
    string private secret;  //declare a private state variable 'secret' of the string type
    string private state;   //declare a private state variable 'state' of the string type
    bool public pseudoRandomResult;  //declare a public state variable 'pseudoRandomResult' of the bool type
    string private ipfsHash;
    event ExperimentComplete (bool result);


    //CONSTRUCTOR FUNCTION//
    constructor () public {  //system contstructor function is identified by having the same name as the contract; it runs once - at contract init on the chain
        owner = msg.sender;            //set 'owner' value to the address that calls the function for the 1st time *always the deployer?*
        you_awesome = "You are awesome"; //set 'you_awesome' value to literal "You're awesome"
        secret = "secret data";  //set 'secret' value to literal "secret data"
        state = "initial state"; //set 'state' value to literal "initial state"
    }

    //FUNCTION 0//
    function getSecret () public view returns(string) {  // public function named 'getSecret' visibility is public, has modifiers view & returns: view allows reads of private state variables & returns is necessary if any value is to be returned to the caller
        return secret;
    }

    //FUNCTION 1//
    function getState () public view returns(string) {  // public function named 'getState' visibility is public, has modifiers view & returns: view allows reads of private state variables & returns is necessary if any value is to be returned to the caller
        return state;
    }

    //FUNCTION 2//
    function setState (string newState) public payable {  // public function named 'setState' visibility is public; 'payable' modifier allows ETH deposits
        state = newState;
    }

    //FUNCTION 3//
    function setExperimentInMotion () public payable returns (bool) {
        bytes32 _pseudoRandomResult = keccak256 (msg.sender, msg.data, msg.value);
        if (_pseudoRandomResult > bytes32(10)) pseudoRandomResult = true;
        else pseudoRandomResult = false;

        emit ExperimentComplete (pseudoRandomResult);
    }

    function setIpfsHash (string newIpfsHash) public {
        ipfsHash = newIpfsHash;
    }

    function getIpfsHash () public view returns(string) {
        return ipfsHash;
    }

    //KILL FUNCTION//
    function kill () public {  //public system function kill
        require (msg.sender == owner);  //address that's calling the function must equal the address value set at init by the deployer
        selfdestruct (owner);  //'selfdestruct' system function pays out any ETH stored on this contract to the designated address, then the storage and code is slated for removal from state
    }

    //FALLBACK FUNCTION//
    function () public payable {  //nameless function is the "fallback" function; 'payable' modifier allows ETH deposits; 'revert' function bounces ETH back to invoker
        revert ();
    }
}
