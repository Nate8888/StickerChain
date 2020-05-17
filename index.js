// Import the Hedera Hashgraph JS SDK
// Example uses Hedera JavaScript SDK v1.1.8
const { Client, CryptoTransferTransaction, AccountId, AccountBalanceQuery  } = require("@hashgraph/sdk");
// Allow access to our .env file variables
require("dotenv").config();

// Grab your account ID and private key from the .env file
const operatorAccountId = process.env.OPERATOR_ID;
const operatorPrivateKey = process.env.OPERATOR_KEY;


// If we weren't able to grab it, we should throw a new error
if (operatorPrivateKey == null ||
    operatorAccountId == null ) {
    throw new Error("environment variables OPERATOR_KEY and OPERATOR_ID must be present");
}

// Create our connection to the Hedera network
// The Hedera JS SDK makes this reallyyy easy!
const client = Client.forTestnet();

// Set your client default account ID and private key used to pay for transaction fees and sign transactions
client.setOperator(operatorAccountId, operatorPrivateKey);

// Hedera is an asynchronous environment :)
(async function() {
    //console.log("balance before transfer:", (await client.getAccountBalance(operatorAccountId)));
    let to
    let stickerHash
    if(process.argv.length > 2){
        const to = process.argv[2];
        const stickerHash = process.argv[3];

        const transactionId = await (await new CryptoTransferTransaction()
            .addSender(operatorAccountId, 1)
            .addRecipient(to, 1)
            .setTransactionMemo("StickerChain "+stickerHash)
            .execute(client))


            //console.log(`attempting to get receipt for transaction id = ${transactionId}\n`);

            const hexTransactionIDForRequest = Buffer.from(`${transactionId}`, 'utf8').toString('hex');
            //console.log(hexTransactionIDForRequest);
            const from = operatorAccountId;
            //console.log(from);

            //onsole.log(process.argv);
            // TODO:::: GET command line input


              const receipt = await transactionId.getReceipt(client);

              console.log(`transaction ${
                  transactionId
              } receipt = ${
                  JSON.stringify(receipt)
              }\n`);


          console.log(transactionId);
          console.log(receipt.getAccountId);


          console.log(`attempting to get record for transaction id = ${transactionId}\n`);
          const record = await transactionId.getRecord(client);
          console.log(`transaction ${
              transactionId
          } record = ${
              JSON.stringify(record)
          }\n`);

          const balance = await new AccountBalanceQuery()
            .setAccountId(operatorAccountId)
            .execute(client);

          console.log(`${operatorAccountId} balance = ${balance.asTinybar()}`);
  }
  else{
    console.log("EXIT(); -> Program Usage: \"node index.js ToAccount ImgHASH\"");
  }
process.exit()
}());
