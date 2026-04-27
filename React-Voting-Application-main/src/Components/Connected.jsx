import React from "react";

const Connected = (props) => {
    return (
        <div className="connected-container">
            <h1 className="connected-header">✓ Connected to MetaMask</h1>
            
            <div className="connected-account">
                <strong>Wallet Address:</strong> {props.account}
            </div>
            
            <div className="connected-account">
                <strong>⏱️ Remaining Time:</strong> {props.remainingTime} seconds
            </div>

            {props.showButton ? (
                <div className="voted-badge">
                    ✓ You have already voted
                </div>
            ) : (
                <div className="input-group">
                    <label htmlFor="candidateInput" style={{color: '#a8edea', fontWeight: '600', marginBottom: '0.5rem'}}>
                        Select Candidate (Enter Index):
                    </label>
                    <input 
                        id="candidateInput"
                        type="number" 
                        placeholder="e.g., 0, 1, 2..." 
                        value={props.number} 
                        onChange={props.handleNumberChange}
                    />
                    <button className="connected-button" onClick={props.voteFunction}>
                        🗳️ Cast Vote
                    </button>
                </div>
            )}
            
            <div className="candidates-wrapper">
                <h2 className="candidates-title">Candidates & Vote Counts</h2>
                <table className="candidates-table">
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th>Candidate Name</th>
                            <th>Vote Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.candidates.map((candidate, index) => (
                            <tr key={index}>
                                <td>{candidate.index}</td>
                                <td>{candidate.name}</td>
                                <td><strong>{candidate.voteCount}</strong></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Connected;