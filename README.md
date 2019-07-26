# Binance Airdrop

Airdrop tool for binance chain

## Installation

`npm i binance-airdrop -g` 

## Usage

Running the script is easy, simply

`binance-airdrop`

It will query for all the required fields. You can also add then upfront.

| Option      | Alias     | Description |
|--------     |-------    |-------------|
| `--network` | `-n`      | Choose binance chain network either 'M' (for mainnet) or 'T' (for testnet) |
| `--mnemonic`| `-m`      | Set the mnemonic phrase from the wallet you would like to airdrop from |
| `--file`    | `-f`      | Default: `airdrop.conf` set a different file name you wish to read the addresses from. It should be a comma seperated list of addresses. The maximum nr of address is 10K |
| `--amount`  | `-a`      | Set the amount you wish to airdrop to each of the addresses |
| `--asset`   |           | Set the asset id you would like to airdrop |
|`--dry-run`  |           | If you set this option, it will show to which addresses will be airdropped and what the costs will be |


### Example

`binance-airdrop -n M -m 'my very very secret phrase' --dry-run`

it will now ask you for the following params:

```
? Please provide the asset you wish to airdrop? LTO-BDF
? Please provide the number of tokens you wish airdrop? 100
```

