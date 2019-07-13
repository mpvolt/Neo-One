/**
 * @jest-environment node
 */

import {withContracts} from "../../one/generated/test";
import BigNumber from 'bignumber.js';
import {Hash256} from "@neo-one/client";



jest.setTimeout(30000);

describe('Token', () => {
    test('exists', async () => {
        await withContracts(async ({ token }) => {
            expect(token).toBeDefined();
        });
    });

    test('properties exist', async () => {
        await withContracts(async ({ token }) => {
            const [
                name,
                symbol,
                decimals,
            ] = await Promise.all([
                token.name(),
                token.symbol(),
                token.decimals(),
            ]);
            expect(name).toEqual('Eon');
            expect(symbol).toEqual('EON');
            expect(decimals.toNumber()).toEqual(8);
        });
    })
    test('methods exist', async() => {
        await withContracts(async ({ token, accountIDs }) => {
            const [
                totalSupply,
                balance,
            ] = await Promise.all([
                token.totalSupply(),
                token.balanceOf(accountIDs[0].address),
            ]);
            expect(totalSupply.toNumber()).toEqual(0);
            expect(balance.toNumber()).toEqual(0);
        });
    })

    test('transfer + mint', async () => {
        await withContracts(async ({ token, accountIDs }) => {
            // We'll use this account for minting
            const accountID = accountIDs[8];
            const amount = new BigNumber(10);

            // Mint the tokens and verify the transaction succeeds
            const mintTokensResult = await token.mintTokens({
                sendTo: [{
                    asset: Hash256.NEO,
                    amount,
                }],
                from: accountID,
            });
            const mintTokensReceipt = await mintTokensResult.confirmed();
            if (mintTokensReceipt.result.state === 'FAULT') {
                throw new Error(mintTokensReceipt.result.message);
            }
            expect(mintTokensReceipt.result.value).toEqual(true);

            // Check that balance and total supply were updated appropriately
            const [balance, totalSupply] = await Promise.all([
                token.balanceOf(accountID.address),
                token.totalSupply(),
            ])

            expect(balance.toNumber()).toEqual(10);
            expect(totalSupply.toNumber()).toEqual(10);

            // Attempt a transfer
            const toAccountID = accountIDs[1];
            const transferAmount = new BigNumber(5);
            const transferReceipt = await token.transfer.confirmed(
                accountID.address,
                toAccountID.address,
                transferAmount,
                { from: accountID },
            );
            if (transferReceipt.result.state === 'FAULT') {
                throw new Error(transferReceipt.result.message);
            }
            expect(transferReceipt.result.value).toEqual(true);

            // Validate the balances are updated appropriately and the total supply has not changed.
            const [fromBalance, toBalance, afterTotalSupply] = await Promise.all([
                token.balanceOf(accountID.address),
                token.balanceOf(toAccountID.address),
                token.totalSupply(),
            ])

            expect(fromBalance.toNumber()).toEqual(amount.minus(transferAmount).toNumber());
            expect(toBalance.toNumber()).toEqual(transferAmount.toNumber());
            expect(afterTotalSupply.toNumber()).toEqual(amount.toNumber());
        });


    })


});
