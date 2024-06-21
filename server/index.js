const express = require("express");
const app = express();
const cors = require("cors");
const secp = require("@noble/secp256k1");
const { recoverPublicKey } = require("@noble/secp256k1");
const { toHex, utf8ToBytes, hexToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const port = 3042;

app.use(cors());
app.use(express.json());


const balances = {
  "8acf6378fc7d39910efb6eb46c16698b70e70ea5": 100,
  "6a147dd8b631bc0745e95e7c69682a8eae718ae9": 50,
  "c7a0db61c2f4c635c7c2c36ce373afce8d13156e": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { signature, recipient, amount } = req.body;
  const sig =  signature.signature
  const recovery = signature.recovery
  console.log("Recovery ", recovery)
  console.log("Signature: ", hexToBytes(sig))
  console.log("Recipient", recipient )
  const u8arraySig = hexToBytes(sig)

  //recover the public address from the signature
  const publicKey = await recoverKey("Transaction", u8arraySig, recovery )
  console.log("Public Key ", publicKey)
  if(publicKey in balances){
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  }else{
    res.status(400).send({message: "Your Private Key is incorrect or you are not in the system"})
  }

  
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function hashMessage(message) {
  return keccak256(utf8ToBytes(message))
}

async function recoverKey(message, signature, recoveryBit){
  const messageHash = hashMessage(message);
  

  const publicKey = recoverPublicKey(messageHash, signature, recoveryBit);
  console.log("Public Key: ", publicKey)
  return toHex(publicKey);
}


function getAddress(publicKey) {
  const step1 = publicKey.slice(1);
  const step2 = keccak256(step1);
  const step3 = step2.slice(-20);
  return step3;
}
