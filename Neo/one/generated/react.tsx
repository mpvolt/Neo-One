/* @hash 675bbb1047e32544cc193c1073e2896b */
// tslint:disable
/* eslint-disable */
import { Client, DeveloperClient, DeveloperTools, LocalClient } from '@neo-one/client';
import * as React from 'react';
import { Contracts } from './types';
import { createClient, createDeveloperClients, createLocalClients } from './client';

import { createTokenSmartContract } from './Token/contract';

export interface WithClients<TClient extends Client> {
  readonly client: TClient;
  readonly developerClients: {
    readonly [network: string]: DeveloperClient;
  };
  readonly localClients: {
    readonly [network: string]: LocalClient;
  };
  readonly host?: string;
}
export type ContractsWithClients<TClient extends Client> = Contracts & WithClients<TClient>;
const Context: any = React.createContext<ContractsWithClients<Client>>(undefined as any);

export type ContractsProviderProps<TClient extends Client> = Partial<WithClients<TClient>> & {
  readonly children?: React.ReactNode;
};
export const ContractsProvider = <TClient extends Client>({
  client: clientIn,
  developerClients: developerClientsIn,
  localClients: localClientsIn,
  host,
  children,
}: ContractsProviderProps<TClient>) => {
  const client = clientIn === undefined ? createClient(host) : clientIn;
  const developerClients = developerClientsIn === undefined ? createDeveloperClients(host) : developerClientsIn;
  const localClients = localClientsIn === undefined ? createLocalClients(host) : localClientsIn;
  DeveloperTools.enable({ client, developerClients, localClients });

  return (
    <Context.Provider
      value={{
        client,
        developerClients,
        localClients,
        token: createTokenSmartContract(client),
      }}
    >
      {children}
    </Context.Provider>
  );
};

export interface WithContractsProps<TClient extends Client> {
  readonly children: (contracts: ContractsWithClients<TClient>) => React.ReactNode;
}
export const WithContracts = <TClient extends Client>({ children }: WithContractsProps<TClient>) => (
  <Context.Consumer>{children}</Context.Consumer>
);
