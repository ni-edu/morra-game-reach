import React from "react";

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export class Deploy extends React.Component {
  render() {
    const { deploy } = this.props;
    return (
      <div>
        <button onClick={deploy}>Deploy</button>
      </div>
    );
  }
};

export class  Deploying extends React.Component {
  render() {
    return <div>Deploying... please wait.</div>;
  }
};

export class WaitingForAttacher extends React.Component {
  async copyToClipboard(button) {
    const { ctcInfoStr } = this.props;
    navigator.clipboard.writeText(ctcInfoStr);
    const origInnerHTML = button.innerHTML;
    button.innerHTML = "Copied!";
    button.disabled = true;
    await sleep(1000);
    button.innerHTML = origInnerHTML;
    button.disabled = false;
  }

  render() {
    const { ctcInfoStr } = this.props;
    return (
      <div>
        Waiting for Attacher to join...
        <br /> Please give them this contract info:
        <pre className="ContractInfo">{ctcInfoStr}</pre>
        <button onClick={(e) => this.copyToClipboard(e.currentTarget)}>
          Copy to clipboard
        </button>
      </div>
    );
  }
};
