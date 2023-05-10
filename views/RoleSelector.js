import React from "react";

export class RoleSelector extends React.Component {
    render() {
      const {selectDeployer,selectAttacher} = this.props;
      return (
        <div>
          Please select a role:
          <br />
          <p>
            <button
              onClick={selectDeployer}
            >Deployer</button>
            <br /> Deploy the contract.
          </p>
          <p>
            <button
              onClick={selectAttacher}
            >Attacher</button>
            <br /> Attach to the Deployer's contract.
          </p>
        </div>
      );
    }
  }