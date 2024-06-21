const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const privateKey = secp.secp256k1.utils.randomPrivateKey();

console.log("Private Key: ", toHex(privateKey));

const publicKey = secp.secp256k1.getPublicKey(privateKey);
console.log("Public Key: ", toHex(publicKey));

function getAddress(publicKey) {
  const step1 = publicKey.slice(1);
  const step2 = keccak256(step1);
  const step3 = step2.slice(-20);
  return step3;
}


