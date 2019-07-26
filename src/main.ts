import arg from 'arg';
import inquirer from 'inquirer';
import { Options } from './schemas';
import { BnbClient } from './bnb';

import {from, Observable} from "rxjs";

import {streamToStringRx} from 'rxjs-stream';
import fs from 'fs';
import {map, switchMap, toArray} from "rxjs/operators";

const MULTI_SEND_FEE = 0.0003;

export async function main() {
  let options = parseArgs(process.argv);
  options = await promptMissingOptions(options);
  const client = new BnbClient(options.network, options.mnemonic);
  await client.initChain();
  console.log(`Going to airdrop from address: ${client.address}`);

  const fileData: Observable<any> = streamToStringRx(fs.createReadStream(options.file)).pipe(
    switchMap(data => from(data.replace(/(\r\n|\n|\r)/gm, "").split(','))),
    map((address) => ({to: address.trim(), coins: [{ denom: options.asset, amount: options.amount}]})),
    toArray()
  );
  fileData.subscribe(async (outputs: any) => {
    try {
      if (options.dryrun) {
        outputs.forEach((tx) => {
          console.log(`Sending ${tx.coins[0].amount} of ${tx.coins[0].denom} to ${tx.to}`);
        });

        console.log(`Sending out total ${outputs.length * options.amount} of ${options.asset}`);
        console.log(`Taking ${outputs.length * MULTI_SEND_FEE} of BNB Fee`)
      } else {
        const res = await client.sendMultiTx(outputs);
        console.log(res);
      }
    } catch(e) {
      console.log(e);
    }
  });
}

const parseArgs = (rawArgs: string[]): Options => {
  const args = arg(
    {
      '--network': String,
      '--mnemonic': String,
      '--file': String,
      '--amount': Number,
      '--asset': String,
      '--dry-run': Boolean,
      '-n': '--network',
      '-m': '--mnemonic',
      '-f': '--file',
      '-a': '--amount'
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return <Options> {
    network: args['--network'] || null,
    file: args['--file'] || 'airdrop.conf',
    mnemonic: args['--mnemonic'] || null,
    amount: args['--amount'] || null,
    asset: args['--asset'] || null,
    dryrun: args['--dry-run'] || false,
  };
};

// @ts-ignore
const promptMissingOptions = async (options: Options): Promise<Options> => {
  const questions = [];
  if (!options.network) {
    questions.push({
      type: 'list',
      name: 'network',
      message: 'Please choose the binance chain network',
      choices: ['T', 'M'],
      default: 'M',
    });
  }

  if (!options.mnemonic) {
    questions.push({
      type: 'input',
      name: 'mnemonic',
      message: 'Please provide the mnemonic of your wallet?'
    });
  }

  if (!options.asset) {
    questions.push({
      type: 'input',
      name: 'asset',
      message: 'Please provide the asset you wish to airdrop?'
    });
  }

  if (!options.amount) {
    questions.push({
      type: 'input',
      name: 'amount',
      message: 'Please provide the number of tokens you wish airdrop?'
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    network: options.network || answers.network,
    mnemonic: options.mnemonic || answers.mnemonic,
    asset: options.asset || answers.asset,
    amount: options.amount || answers.amount,
  };
};

