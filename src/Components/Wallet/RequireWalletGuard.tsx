import { useWeb3Modal } from '../../Hooks/useWeb3Modal';
import ConnectWalletButton from './ConnectWalletButton';

export default function RequireWalletGuard({ children }: React.PropsWithChildren<{}>): JSX.Element
{
    const { isWalletConnected } = useWeb3Modal();

    return (isWalletConnected ? <>{children}</> : <ConnectWalletButton />);
}
