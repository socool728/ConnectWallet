import { useCallback, useContext, useRef } from "react";

import { ethers } from "ethers";
// https://github.com/Web3Modal/web3modal
import Web3Modal from "web3modal";

import { WalletContext } from "../Context/WalletContext";
import { toError } from "../Util";

const providerOptions = {
    /*injected: {
        display: {
          name: "Metamask",
          description: "Connect with the provider in your Browser",
        },
        package: null,
    },*/
    binancechainwallet: {
        package: true
    }
} as const;

const web3Modal = new Web3Modal({
    network: "mainnet",
    // theme: "dark",
    cacheProvider: true,
    disableInjectedProvider: false,
    providerOptions
});

interface Web3ModalConnection
{
    on(event: "accountsChanged", listener: (accounts: Array<string>) => void): void;
    on(event: "chainChanged", listener: (chainId: number) => void): void;
    on(event: "connect", listener: (info: { chainId: number }) => void): void;
    on(event: "disconnect", listener: (error: { code: number; message: string }) => void): void;
}

export function useWeb3Modal()
{
    const walletContext = useContext(WalletContext);
    // Setters
    const { setIsConnecting, setError, setProvider, setAddress, setIsWalletConnected } = walletContext;
    // Returned values
    const { isConnecting, error, provider, address, isWalletConnected } = walletContext;
    // Keep reference to this object, so attachConnectionEvents() 
    // is not called each time web3Modal.connect() is called
    // /!\ Behavior to be aware of (that could lead to a bug) : this object seems to be shared by all the
    // connections by a particular wallet (connect, disconnect, and then reconnect => exact same object, same
    // reference). But each wallet has a different connection object.
    // So if we connect with one wallet, and then disconnect, and then reconnect, the reference will not be
    // the same as the previous one (different wallet), so attachConnectionEvents() will be called once again
    // That's why it's better to store all the references on which the listeners are already be applied
    const web3ModalConnectionRef = useRef<Set<Web3ModalConnection>>(new Set());

    const setProviderAfterConnect = useCallback(async (provider: ethers.providers.Web3Provider) => {
        setError(null);
        setProvider(provider);
        setAddress(await provider.getSigner().getAddress());
        setIsWalletConnected(true);
    }, [ setAddress, setError, setIsWalletConnected, setProvider ]);

    const setDisconnected = useCallback((error: Error) => {
        console.log("setDisconnected", error.message);
        setError(error);
        setIsWalletConnected(false);
        setAddress(null);
        web3Modal.clearCachedProvider();
    }, [ setError, setIsWalletConnected, setAddress ]);

    const setConnected = useCallback((address: string, chainId: string | number) => {
        // chainId : chaine hex ou integer
        console.log(`setConnected(${address}, ${chainId})`);
        setIsConnecting(false);
        setError(null);
        setAddress(address);
        setIsWalletConnected(true);
    }, [ setIsConnecting, setError, setAddress, setIsWalletConnected ]);

    const attachConnectionEvents = useCallback((connection: Web3ModalConnection) => {
        console.log("attachConnectionEvents to ", connection)
        // Subscribe to accounts change
        connection.on("accountsChanged", (accounts: Array<string>) => {
            const currentAccount: string | undefined = accounts[0];

            // We're connected
            if (typeof currentAccount === "string")
            {
                setAddress(currentAccount);
                setIsWalletConnected(true);
            }
            // Disconnected
            else
            {
                setError(new Error("User account disconnected"));
                setIsWalletConnected(false);
            }

            // si accounts[0] n'est pas un string => on est déconnecté
            console.log("accountsChanged" + accounts[0], accounts);
        });

        // Subscribe to chainId change
        connection.on("chainChanged", async (chainId: number) => {
            console.log("chainChanged", chainId);
            if (provider !== null)
            {
                const address: string = await provider.getSigner().getAddress();
                setConnected(address, chainId);
            }
        });

        // Subscribe to provider connection
        connection.on("connect", async (info: { chainId: number }) => {
            console.log("connect", info);
            if (provider !== null)
            {
                const address: string = await provider.getSigner().getAddress();
                setConnected(address, info.chainId);
            }
        });

        // Subscribe to provider disconnection
        connection.on("disconnect", (error: { code: number; message: string; }) => {
            setDisconnected(new Error(error.message));
            console.log("disconnect", error);
        });
    }, [ setAddress, setDisconnected, setError, setIsWalletConnected, setConnected, provider ]);

    const connect = useCallback(async () => {
        setIsConnecting(true);
        try {
            const connection: Web3ModalConnection = await web3Modal.connect();
            if (web3ModalConnectionRef.current.has(connection) === false)
            {
                web3ModalConnectionRef.current.add(connection);
                attachConnectionEvents(connection);
            }
            const provider = new ethers.providers.Web3Provider(connection as any);
            console.log("provider", provider);
            setProviderAfterConnect(provider);
        }
        catch (error) {
            setError(toError(error));
        }
        finally {
            setIsConnecting(false);
        }
    }, [ attachConnectionEvents, setError, setIsConnecting, setProviderAfterConnect ]);

    const disconnect = useCallback((error: Error) => {
        setDisconnected(error);
    }, [ setDisconnected ]);

    return {
        isConnecting,
        error,
        provider,
        address,
        isWalletConnected,
        connect,
        disconnect
    };
}
