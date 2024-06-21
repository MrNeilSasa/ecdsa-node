import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";
import { sign, utils } from "@noble/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";

async function signMessage(transaction, privateKey) {
  const messageBytes = utf8ToBytes(transaction);
  const messageHash = keccak256(messageBytes);

  const signatureObj = await sign(messageHash, privateKey, { recovered: true});
  console.log("Signature Object: ", signatureObj)
  const hexSignature = toHex(signatureObj[0])
  const recovery = signatureObj[1]
  const dataToSend = {
    signature: hexSignature,
    recovery: recovery
  }

  return dataToSend
}

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [signature, setSignature] = useState(null);

  const handleSignMessage = async () => {
    try {
      const signedMessage = await signMessage("Transaction", privateKey);
      console.log("Signed Message: ", signedMessage)
      setSignature(signedMessage);
      
    } catch (error) {
      console.error("Error signing message:", error);
    }
  };

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        address={address}
        setAddress={setAddress}
      />
      <button onClick={handleSignMessage}> Click this button to sign with Private Key and view Transfer</button>

      {signature && (
        <Transfer
          setBalance={setBalance}
          signature={signature}
        />
      )}
    </div>
  );
}

export default App;
