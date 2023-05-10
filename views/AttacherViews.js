import React from "react";

export class Attach extends React.Component {
  render() {
    const { attach } = this.props;
    const { ctcInfoStr } = this.state || {};
    return (
      <div>
        Please paste the contract info to attach to:
        <br />
        <textarea
          spellCheck="false"
          className="ContractInfo"
          onChange={(e) => this.setState({ ctcInfoStr: e.currentTarget.value })}
          placeholder="{}"
        />
        <br />
        <button
          disabled={!ctcInfoStr}
          onClick={() => attach(ctcInfoStr)}
        >
          Attach
        </button>
      </div>
    );
  }
};

export class Attaching extends React.Component {
  render() {
    return <div>Attaching, please wait...</div>;
  }
};

export class WaitingForTurn extends React.Component {
  render() {
    return (
      <div>
        Waiting for the other player...
        <br />
        Think about which move you want to play.
      </div>
    );
  }
};

