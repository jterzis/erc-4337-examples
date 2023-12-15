import { ethers } from "ethers";
import { ERC20_ABI } from "../../src";
// @ts-ignore
import config from "../../config.json";
import { Client, IUserOperationMiddlewareCtx, Presets } from "userop";
import { CLIOpts } from "../../src";

export default async function main(
  tkn: string,
  t: string,
  amt: string,
  opts: CLIOpts
) {
  //const paymasterMiddlewareWrapper = 
  const paymasterMiddleware = opts.withPM
    ? Presets.Middleware.verifyingPaymaster(
        config.paymaster.rpcUrl,
        config.paymaster.context
      )
    : undefined;

  const fetchData = async () => {
    // todo: test fetching data from a worker to service the middleware request
    await new Promise(resolve => setTimeout(resolve, 2));
  }

  const paymasterMiddlewareWrapper = (ctx: IUserOperationMiddlewareCtx): Promise<void> => {
    return fetchData().then(() => {
    if (paymasterMiddleware) {
      return paymasterMiddleware(ctx);
    }
    return Promise.resolve();
  }
    ).catch(error => {
      console.error(error);
      return Promise.resolve();
    })
  }

  const simpleAccount = await Presets.Builder.SimpleAccount.init(
    new ethers.Wallet(config.signingKey),
    config.rpcUrl,
    { paymasterMiddleware: paymasterMiddlewareWrapper, overrideBundlerRpc: opts.overrideBundlerRpc }
  );
  const client = await Client.init(config.rpcUrl, {
    overrideBundlerRpc: opts.overrideBundlerRpc,
  });

  const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
  const token = ethers.utils.getAddress(tkn);
  const to = ethers.utils.getAddress(t);
  const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
  const [symbol, decimals] = await Promise.all([
    erc20.symbol(),
    erc20.decimals(),
  ]);
  const amount = ethers.utils.parseUnits(amt, decimals);
  console.log(`Transferring ${amt} ${symbol}...`);

  const fakeMiddleware = (ctx: IUserOperationMiddlewareCtx) => {
    // unnecessary, but just to show how to write a function that is called as a middleware
    const userOp = ctx.getUserOpHash();
    console.log(`userOp: ${userOp}`);
    return Promise.resolve();

}
  const res = await client.sendUserOperation(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    simpleAccount.useMiddleware(fakeMiddleware).execute(
      erc20.address,
      0,
      erc20.interface.encodeFunctionData("transfer", [to, amount])
    ),
    {
      dryRun: opts.dryRun,
      onBuild: (op) => console.log("Signed UserOperation:", op),
    }
  );
  console.log(`UserOpHash: ${res.userOpHash}`);

  console.log("Waiting for transaction...");
  const ev = await res.wait();
  console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);
}
