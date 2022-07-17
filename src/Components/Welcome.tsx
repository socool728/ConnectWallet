import ConnectWalletButton from "./Wallet/ConnectWalletButton";
import RequireWalletGuard from "./Wallet/RequireWalletGuard";

export default function Welcome(): JSX.Element
{
    return (
        <>
            <ConnectWalletButton />
            <h1>Welcome !</h1>

            <RequireWalletGuard>
                Congratulations, you can now use the app !
            </RequireWalletGuard>
        </>
    );
}
