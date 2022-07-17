import { Button } from "@mui/material";

import { useWeb3Modal } from "../../Hooks/useWeb3Modal";

export default function ConnectWalletButton(): JSX.Element
{
    const { connect, disconnect, isConnecting, isWalletConnected, address, error } = useWeb3Modal();

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
                Connected as {address}
                <Button variant="contained" color="primary" onClick={() => disconnect(new Error("User click disconnect"))}>
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
