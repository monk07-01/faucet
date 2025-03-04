const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

// Rate limiter to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many requests. Please try again later."
});
app.use(limiter);

// Configurable values
const FAUCET_ACCOUNT = "faucet";
const FAUCET_AMOUNT = "1000000000000000000abfh"; // 1 BFH assuming 10^18 decimals
const CHAIN_ID = "bfhevm_777-1";
const NODE_RPC = "tcp://0.0.0.0:26657";

// Token claim endpoint
app.post("/claim", (req, res) => {
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  const cmd = `bfhevmd tx bank send ${FAUCET_ACCOUNT} ${address} ${FAUCET_AMOUNT} --chain-id ${CHAIN_ID} --keyring-backend test --fees 200abfh --node ${NODE_RPC} --yes`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: "Transaction failed", details: stderr });
    }
    return res.json({ message: "Tokens sent successfully!", tx: stdout });
  });
});

app.listen(6000, () => console.log("Faucet backend running on port 6000"));
