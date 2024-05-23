import { connectWallet } from '../store/walletStore'; // Ensure this import is correct
import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router'; // Import useNavigate

const SignUpSlide = () => {
    const [isWalletConnected, setIsWalletConnected] = createSignal(false);
    const navigate = useNavigate(); // Get the navigate function

    const handleConnectWallet = async () => {
        await connectWallet();
        setIsWalletConnected(true);
    };

    return (
        <div class="sign-up-slide flex flex-col items-center justify-center h-screen">
            {!isWalletConnected() && (
                <>
                    <h1 class="text-2xl font-bold">Learn to Earn!</h1>
                    <p class="text-xl">Study English daily, get rewards!</p>
                    <button
                        onClick={handleConnectWallet}
                        class="mt-4 bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-full"
                    >
                        Connect Wallet
                    </button>
                </>
            )}
            {isWalletConnected() && (
                <>
                    <h1 class="text-2xl font-bold">Start a Study Session</h1>
                    <p class="text-xl">Study the words from the song!</p>
                    <button
                        onClick={() => navigate('/sign')} // Use navigate function here
                        class="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                    >
                        Start Learning
                    </button>
                </>
            )}
        </div>
    );
};

export default SignUpSlide;