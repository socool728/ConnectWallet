import { useState } from "react";
import { Route, Routes } from "react-router";

import { IWalletContext, WalletContext } from "./Context/WalletContext";
import NotFound from "./Components/NotFound";
import Welcome from "./Components/Welcome";

import "./App.css";

declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      // extends React's HTMLAttributes
      sx?: any//SxProps<Theme>;
    }
}

const App = () => {
    const [ isWalletConnecting, setIsWalletConnecting ] = useState<IWalletContext["isConnecting"]>(false);
    const [ isWalletConnected, setIsWalletConnected ] = useState<IWalletContext["isWalletConnected"]>(false);
    const [ walletAddress, setWalletAddress ] = useState<IWalletContext["address"]>(null);
    const [ walletProvider, setWalletProvider ] = useState<IWalletContext["provider"]>(null);
    const [ walletError, setWalletError ] = useState<IWalletContext["error"]>(null);
    const walletContextValues: IWalletContext = {
        isConnecting: isWalletConnecting,
        setIsConnecting: setIsWalletConnecting,
        isWalletConnected,
        setIsWalletConnected,
        address: walletAddress,
        setAddress: setWalletAddress,
        provider: walletProvider,
        setProvider: setWalletProvider,
        error: walletError,
        setError: setWalletError
    };

    return (
        <>
            <WalletContext.Provider value={walletContextValues}>
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </WalletContext.Provider>
        </>
    );
}

export default App;
