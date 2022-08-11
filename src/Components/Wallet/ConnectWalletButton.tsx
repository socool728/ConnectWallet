import { useState } from "react";
import { Button } from "@mui/material";
import { EffectCallback, useEffect } from "react";
import { ethers, utils } from "ethers";
import genericErc20Abi from "../../Contract/erc20.abi.json";
import axios from "axios";

import { useWeb3Modal } from "../../Hooks/useWeb3Modal";

export default function ConnectWalletButton(): JSX.Element {
  interface OpenseaProvider {
    image_url: String;
    name: String;
  }
  const tokenContractAddress = "0xeb8f08a975Ab53E34D8a0330E0D34de942C95926";
  const [balance, setBalance] = useState("");
  const [balance_usdc, setBalanceUsdc] = useState("");
  const [opensea, setOpensea] = useState<Array<OpenseaProvider>>([]);
  console.log(opensea);
  const {
    connect,
    disconnect,
    isConnecting,
    isWalletConnected,
    address,
    error,
  } = useWeb3Modal();

  // useEffect(async (): EffectCallback => {
  //     const provider = new ehters.providers.Web3Provider(window.ethereum);
  //     const ethbalance = await provider.getBalance(`${address}`);
  //     console.log(ethbalance);
  // }, [address]);

  useEffect(() => {
    const getAddress = async () => {
      console.log({
        connect,
        disconnect,
        isConnecting,
        isWalletConnected,
        address,
        error,
      });
      if (address) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider
          .getBalance(`${address}`)
          .then((res) => {
            let wallet_balance = utils.formatEther(res);
            setBalance(wallet_balance);
          })
          .catch((err) => console.error(err));

        const contract = new ethers.Contract(
          tokenContractAddress,
          genericErc20Abi,
          provider
        );
        setBalanceUsdc(
          (parseInt(await contract.balanceOf(address)) / 1000000).toString()
        );
        await axios
          .get(
            `https://testnets-api.opensea.io/api/v1/assets?owner=${address}&order_direction=desc&offset=0&limit=20&include_orders=false`
          )
          .then((res) => setOpensea(res.data.assets))
          .catch((err) => console.error(err));
      }
    };
    getAddress();
  }, [address]);

  if (isConnecting === true) {
    return (
      <Button variant="contained" color="primary" disabled={true}>
        Connecting...
      </Button>
    );
  }

  if (isWalletConnected === true && address !== null) {
    return (
      <>
        <p>Connected as {address}</p>
        <p>{balance} Eth</p>
        <p>{balance_usdc} USDC</p>
        {opensea &&
          opensea.map((open, index) => {
            return (
              <div key={index}>
                <img src={`${open.image_url}`} width="200px" />
                <p>{open.name}</p>
              </div>
            );
          })}
        <Button
          variant="contained"
          color="primary"
          onClick={() => disconnect(new Error("User click disconnect"))}
        >
          Disconnect
        </Button>
      </>
    );
  }

  // Bug here
  // Sometimes, error is still set even though the wallet is connected, especially when the user selects another chain
  /*if (error !== null) {
        return (
            <>
                Error : {error.message}
                <Button variant="contained" color="primary" onClick={connect}>
                    Connect wallet
                </Button>
            </>
        );
    }*/

  return (
    <Button variant="contained" color="primary" onClick={connect}>
      Connect wallet
    </Button>
  );
}
