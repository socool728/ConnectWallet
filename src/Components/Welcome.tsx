import ConnectWalletButton from "./Wallet/ConnectWalletButton";
import RequireWalletGuard from "./Wallet/RequireWalletGuard";

export default function Welcome(): JSX.Element {
  return (
    <div id="welcome">
      <h1>Welcome !</h1>
      <ConnectWalletButton />

      {/* <RequireWalletGuard>
        Congratulations, you can now use the app !
      </RequireWalletGuard> */}
    </div>
  );
}
