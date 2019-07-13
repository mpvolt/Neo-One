/* @hash 0bd671900524df2e0a5704403cef8bfe */
// tslint:disable
/* eslint-disable */
import { Client, SmartContractDefinition } from '@neo-one/client';
import { sourceMaps } from '../sourceMaps';
import { tokenABI } from './abi';
import { TokenSmartContract } from './types';

const definition: SmartContractDefinition = {
  networks: {
    local: {
      address: 'AVaXsHMzBr3KuxnQr3WMivk6fuoXvre4C1',
    },
  },
  abi: tokenABI,
  sourceMaps,
};

export const createTokenSmartContract = <TClient extends Client>(client: TClient): TokenSmartContract<TClient> =>
  client.smartContract<TokenSmartContract<TClient>>(definition);
