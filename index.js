import ReactDOM from 'react-dom';
import React from 'react';
import { Deploy, Deploying, WaitingForAttacher } from "./views/DeployerViews";
import { Attach, Attaching } from "./views/AttacherViews";
import "./index.css";
import * as backend from "./build/index.main.mjs";
import { loadStdlib } from "@reach-sh/stdlib/browser";
import { AppWrapper } from "./views/AppWrapper";
import { RoleSelector } from "./views/RoleSelector";
import { DeployerWrapper } from "./views/DeployerWrapper";
import { AttacherWrapper } from "./views/AttacherWrapper";
import {
  Done,
  GetFingers,
  GetNumber,
  WaitingForResults,
} from "./views/PlayerViews";
const reach = loadStdlib(process.env);

const allResults = ["It's a Draw", "Alice Wins!", "Bob Wins!", "No Result"];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "connecting",
      defaultFundAmt: "10",
      defaultWager: "3",
      standardUnit: reach.standardUnit,
    };
  }
  async componentDidMount() {
    const acc = await reach.newTestAccount(reach.parseCurrency(1100));
    this.setState({ acc, bal: 1100 });
    this.setState({ mode: "selecting" });
  }

  selectAttacher = () => {
    this.setState({mode: "attacher" });
  };
  selectDeployer = () => {
    this.setState({mode: "deployer" });
  };
  render() {
    const { mode } = this.state;

    return (
      <AppWrapper>
        {mode === "connecting" && (
          <div>
            Please wait while we connect to your account. If this takes more
            than a few seconds, there may be something wrong.
          </div>
        )}
        {mode === "selecting" && (
          <RoleSelector
            selectDeployer={this.selectDeployer}
            selectAttacher={this.selectAttacher}
          />
        )}
        {mode === "deployer" && <Deployer acc={this.state.acc} />}
        {mode === "attacher" && <Attacher acc={this.state.acc} />}
      </AppWrapper>
    );
  }
}

class Player extends React.Component {
  random() {
    return reach.hasRandom.random();
  }

  getFingers = async () => {
    const numberOfFingers = await new Promise((resolveHandF) => {
      this.setState({ mode: "getFingers", playable: true, resolveHandF });
    });
    this.setState({ mode: "waitingForResults", numberOfFingers });
    return numberOfFingers;
  };
  sayNumber = async () => {
    const numberTold = await new Promise((resolveHandN) => {
      this.setState({ mode: "getNumber", playable: true, resolveHandN });
    });
    this.setState({ mode: "waitingForResults", numberTold });
    return numberTold;
  };

  showResult = (res) => {
    this.setState({ mode: "done", outcome: allResults[res] });
  };

  playFinger = (numberOfFingers) => {
    this.state.resolveHandF(numberOfFingers);
  };

  finalNumber = (numberTold) => {
    this.state.resolveHandN(numberTold);
  };

  getPlayerContent = () => {
    const { mode } = this.state;
    switch (mode) {
      case "getFingers":
        return (
          <GetFingers
            playFinger={this.playFinger}
            playable={this.state.playable}
          />
        );
      case "waitingForResults":
        return <WaitingForResults />;
      case "getNumber":
        return (
          <GetNumber
            playable={this.state.playable}
            finalNumber={this.finalNumber}
          />
        );
      case "done":
        return <Done outcome={this.state.outcome} />;
      default:
        return null;
    }
  };
}

class Deployer extends Player {
  constructor(props) {
    super(props);
    this.state = { mode: "deploy" };
  }

  deploy = async () => {
    const ctc = this.props.acc.contract(backend);
    this.setState({ mode: "deploying", ctc });
    this.deadline = { ETH: 10, ALGO: 100, CFX: 1000 }[reach.connector];
    backend.Alice(ctc, this);
    const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2);
    this.setState({ mode: "waitingForAttacher", ctcInfoStr });
  };

  render() {
    const { mode } = this.state;
    const playerContent = this.getPlayerContent();
    if (playerContent) {
      return <DeployerWrapper>{playerContent}</DeployerWrapper>;
    }

    return (
      <DeployerWrapper>
        {mode === "deploy" && <Deploy deploy={this.deploy} />}
        {mode === "deploying" && <Deploying />}
        {mode === "waitingForAttacher" && (
          <WaitingForAttacher ctcInfoStr={this.state.ctcInfoStr} />
        )}
      </DeployerWrapper>
    );
  }
}

class Attacher extends Player {
  constructor(props) {
    super(props);
    this.state = { mode: "attach" };
  }
  attach = (ctcInfoStr) => {
    const ctc = this.props.acc.contract(backend, JSON.parse(ctcInfoStr));
    this.setState({ mode: "attaching" });
    backend.Bob(ctc, this);
  };

  render() {
    const { mode } = this.state;
    const playerContent = this.getPlayerContent();
    if (playerContent) {
      return <AttacherWrapper>{playerContent}</AttacherWrapper>;
    }
    return (
      <AttacherWrapper>
        {mode === "attach" && <Attach attach={this.attach} />}
        {mode === "attaching" && <Attaching />}
      </AttacherWrapper>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>{<App />}</React.StrictMode>,
  document.getElementById('root')
);
