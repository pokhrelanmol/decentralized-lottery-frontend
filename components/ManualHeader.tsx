import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
import CircularLoader from "./CircularLoader";

const ManualHeader = () => {
    const {
        enableWeb3,
        account,
        isWeb3Enabled,
        Moralis,
        deactivateWeb3,
        isWeb3EnableLoading,
    } = useMoralis();
    useEffect(() => {
        if (isWeb3Enabled) return;
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3();
            }
        }
    }, [enableWeb3]);
    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(account);
            if (account == null) {
                window.localStorage.removeItem("connected");
                deactivateWeb3();
            }
        });
    }, []);
    return (
        <div className="pt-10">
            {account ? (
                <button
                    disabled
                    className=" uppercase bg-transparent bg-blue-500  font-semibold text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                >
                    {account?.slice(0, 6)}...
                    {account?.slice(account.length - 4)}
                </button>
            ) : (
                <button
                    disabled={isWeb3EnableLoading}
                    className=" uppercase bg-transparent bg-blue-500  font-semibold text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                    onClick={async () => {
                        await enableWeb3();
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem(
                                "connected",
                                "injected"
                            );
                        }
                    }}
                >
                    {isWeb3EnableLoading ? <CircularLoader /> : "Connect"}
                </button>
            )}
        </div>
    );
};

export default ManualHeader;
