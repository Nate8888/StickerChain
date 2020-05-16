// Import the Hedera Hashgraph JS SDK
// Example uses Hedera JavaScript SDK v1.1.8
const { Client, CryptoTransferTransaction, AccountId } = require("@hashgraph/sdk");
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
    console.log("balance before transfer:", (await client.getAccountBalance(operatorAccountId)));

    const transactionId = await (await new CryptoTransferTransaction()
        .addSender(operatorAccountId, 1)
        .addRecipient("0.0.3", 1)
        .setTransactionMemo("StickerChain HASH")
        .execute(client))


        console.log(`attempting to get receipt for transaction id = ${transactionId}\n`);

        const hexTransactionIDForRequest = Buffer.from(`${transactionId}`, 'utf8').toString('hex');
        console.log(hexTransactionIDForRequest)
        const from = operatorAccountId
        console.log(from)

        //console.log(process.argv);
        // TODO:::: GET command line input
        const to = process.argv
        const stickerHash = process.argv

        const receipt = await transactionId.getReceipt(client);

        console.log(`transaction ${
            transactionId
        } receipt = ${
            JSON.stringify(receipt)
        }\n`);


    console.log(transactionId);
    console.log(receipt.getAccountId)


    console.log(`attempting to get record for transaction id = ${transactionId}\n`);
    const record = await transactionId.getRecord(client);
    console.log(`transaction ${
        transactionId
    } record = ${
        JSON.stringify(record)
    }\n`);
    console.log("balance after transfer:", (await client.getAccountBalance(operatorAccountId)));

}());
