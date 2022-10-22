import React from "react";
import { ConnectButton } from "@web3uikit/web3";
const Header = () => {
    return (
        <nav className="flex justify-between items-center pt-5 ">
            <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600">
                Decentralized Raffle
            </p>
            <ConnectButton moralisAuth={false} />
        </nav>
    );
};

export default Header;
