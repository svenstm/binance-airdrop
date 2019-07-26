import BnbApiClient from '@binance-chain/javascript-sdk';
// import { crypto } from '@binance-chain/javascript-sdk';

const TESTNET_API = 'https://testnet-dex.binance.org/';
const MAINNET_API = 'https://dex.binance.org/';

export class BnbClient {

  private client: BnbApiClient;
  private privKey: string;
  public address: string;

  constructor(network: 'T' | 'M', mnemonic: string) {

    if (network == 'T') {
      this.client = new BnbApiClient(TESTNET_API);
      this.client.chooseNetwork("testnet"); // or this can be "mainnet"
    } else {
      this.client = new BnbApiClient(MAINNET_API);
      this.client.chooseNetwork("mainnet"); // or this can be "mainnet"
    }

    const { privateKey, address } = this.client.recoverAccountFromMnemonic(mnemonic);
    this.privKey = privateKey;
    this.address = address;
  }

  async initChain(): Promise<void> {
    await this.client.setPrivateKey(this.privKey);
    return this.client.initChain();
  }

  sendMultiTx(outputs): Promise<any> {
    return this.client.multiSend(this.address, outputs);
  }
}
