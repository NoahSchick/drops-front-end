import React, { useState } from "react"
import { ethers } from "ethers";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import PendingPage from "./pending-page"
import ConfirmedPage from "./confirmed-page"
import './App.css';

function App() {

  const [transactionPending, setTransactionPending] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);
  let navigate = useNavigate()

  async function connectWallet() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    console.log("Account:", await signer.getAddress());
  }

  const sendPayment = async (e) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        // Prompt user for account connections
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const tx = await signer.sendTransaction({
          to: "0x892a5ED460Fc600889d57ff6595B8Ba705Edf738",
          value: ethers.utils.parseEther(`${e}`)
        })
        console.log(tx)
        if (tx) {
          setTransactionPending(true)
          setTransactionHash(tx.hash)
        }

        const receipt = await tx.wait();
        console.log(receipt)
        if (receipt) {
          setTransactionPending(false)
          setTransactionConfirmed(true)
        }

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const postMessageToDiscord = message => {
    const request = new XMLHttpRequest();
      request.open("POST", "WEBHOOK URL");

      request.setRequestHeader('Content-type', 'application/json');

      const params = {
        // username: "My Webhook Name",
        // avatar_url: "",
        content: message || "Hello"
      }

      request.send(JSON.stringify(params));
  }

  return (
    <>
      <Routes>
        <Route path="payment" element={<PendingPage />} />
      </Routes>
        {
          transactionPending ?
          navigate("/payment") :
          <div className="App">
            <button onClick={() => connectWallet()}>Connect Wallet</button>
            <button onClick={() => sendPayment(.001)}>.15</button>
            <button onClick={() => sendPayment(.35)}>.35</button>
            <button onClick={() => sendPayment(.6)}>.6</button>
            <button onClick={() => postMessageToDiscord("What up doe!")}>Send message</button>
          </div>
        }
    </>
  );
}

export default App;
