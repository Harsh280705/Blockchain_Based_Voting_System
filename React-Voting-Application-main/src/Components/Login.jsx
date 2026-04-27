import React from "react";

const Login = (props) => {
    return (
        <div className="login-container">
            <h1 className="welcome-message">Welcome to Decentralized Voting</h1>
            <p className="welcome-subtext">Connect your wallet to cast your vote securely on the blockchain</p>
            <button className="login-button" onClick={props.connectWallet}>
                🔐 Login with MetaMask
            </button>
        </div>
    )
}

export default Login;