import { getNeoDapiInstances } from './code/walletApi/neoline.js'
import { SeraphIDWallet, SeraphIDIssuer } from '@sbc/seraph-id-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as configs from './configs';
const ownerWallet = new SeraphIDWallet({ name: "ownerWallet" });

const generateDID = async () => {
  let neo3Dapi;
  try{
      neo3Dapi = (await getNeoDapiInstances()).neo3Dapi;
  } catch (e) {
      alert("You have not installed the browser plugin \"neoline\". \nPlease run this demo in a chrome browser with the extension neoline installed.\nRedirecting to chrome webstore...");
      window.location.href = "https://chrome.google.com/webstore/search/neoline";
  }
  const { address, label } = await neo3Dapi.getAccount();
  console.log("address is: ", address);

  const did = ownerWallet.createDID(configs.DID_NETWORK, address);
  localStorage.setItem('ownerDID', did);
  console.log('created DID', did);

  if (did) {
    console.log("success")
  } else {
      console.log("failure")
  }

}
const issueCredential = () => {

  const demoIssuer = new SeraphIDIssuer(configs.GOVERNMENT_SCRIPT_HASH, configs.NEO_RPC_URL, configs.DID_NETWORK, configs.MAGIC)
  const ownerDID = localStorage.getItem('ownerDID');
  console.log("using ownerDID", ownerDID)
  const claimID = uuidv4();
  const newClaim = demoIssuer.createClaim(claimID, configs.PASSPORT_SCHEMA_NAME,
      {
          'idNumber': 'J12393496',
          'address': "london",
          'birthDate': "01.01.1940",
          'citizenship': "london",
          'firstName': "Oliver",
          'gender': "male",
          'secondName': "d"
      }, ownerDID ? ownerDID : '');

  console.log('new created Claim', newClaim);
  demoIssuer.issueClaim(newClaim, configs.GOVERNMENT_ISSUER_PRIVATE_KEY).then(
      res => {
          setTimeout(() => {
              console.log('issueClaimID RES', res.id);

              try {
                  ownerWallet.addClaim(res);
                  const addedClaim = ownerWallet.getClaim(res.id);
                  console.log('claim Added to the Wallet: ', addedClaim);

                  localStorage.setItem('passportClaimID', res.id);
                  localStorage.setItem('passportClaim', JSON.stringify(res));
              }
              catch (err) {
                  console.error('issueClaim ERR', err);
              }
          }, 2000);
      }
  ).catch(err => {
      console.error('issueClaim ERR', err);
  });
}


function App() {
  return (
    <div className="App">
      <div>
        <p>1. Create a DID</p>
        <button onClick={generateDID}>Generate DID</button>
      </div>
      <div>
      <p>2. Issue an ID</p>
        <button onClick={issueCredential}>Issue Credential</button>
      </div>
    </div>
  );
}

export default App;
