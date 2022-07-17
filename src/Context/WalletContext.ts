import { ethers } from "ethers";
import { createContext } from "react";

export interface IWalletContext
{
    isConnecting: boolean;
    setIsConnecting: (isConnecting: boolean) => void;
    isWalletConnected: boolean;
    setIsWalletConnected: (isWalletConnected: boolean) => void;
    address: string | null;
    setAddress: (address: string | null) => void;
    provider: ethers.providers.Web3Provider | null;
    setProvider: (provider: ethers.providers.Web3Provider | null) => void;
    error: Error | null;
    setError: (error: Error | null) => void;
}

export const WalletContext = createContext<IWalletContext>({
    isConnecting: false,
    setIsConnecting: () => {},
    isWalletConnected: false,
    setIsWalletConnected: () => {},
    address: null,
    setAddress: () => {},
    provider: null,
    setProvider: () => {},
    error: null,
    setError: () => {}
});
