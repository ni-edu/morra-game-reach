import React from 'react';

// Player views must be extended.
// It does not have its own Wrapper view.

export class GetFingers extends React.Component {
  render() {
    let numberOfFingers =  0;
    const {playFinger, playable} = this.props;

    function handleChange(e){
      console.log("Changed Value:", e.currentTarget.value);
      numberOfFingers=e.currentTarget.value;
      console.log("Number of finger selected: ", numberOfFingers);
    }
    return (
      <div>
        {!playable ? 'Please wait...' : ''}
        <br />
        <input
          type='number'
          placeholder='Number should be 0-5'
          onChange={(e) => handleChange(e)}
        /> 
        <br />
        <button
          disabled={!playable}
          onClick={() => playFinger(numberOfFingers)}
        >Show Finger</button>
        
      </div>
    );
  }
}

export class GetNumber extends React.Component {
  render() {
    let number =  0;
    const {playable,finalNumber} = this.props;

    function handleChange(e){
      console.log("Changed Value:", e.currentTarget.value);
      number=e.currentTarget.value;
      console.log("Number selected: ", number);
    }
    return (
      <div>
        {!playable ? 'Please wait...' : ''}
        <br />
        <input
          type='number'
          placeholder='enter'
          onChange={(e) => handleChange(e)}
        /> 
        <br />
        <button
          disabled={!playable}
          onClick={() => finalNumber(number)}
        >Say Number</button>
        
      </div>
    );
  }
}

export  class WaitingForResults extends React.Component {
  render() {
    return (
      <div>
        Waiting for results...
      </div>
    );
  }
}

export class Done extends React.Component {
  render() {
    const {outcome} = this.props;
    return (
      <div>
        Thank you for playing. The outcome of this game was:
        <br />{outcome || 'Unknown'}
      </div>
    );
  }
}