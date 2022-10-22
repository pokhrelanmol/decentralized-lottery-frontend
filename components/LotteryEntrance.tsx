import React, { useEffect } from "react";
import { ethers } from "ethers";
import { Button, useNotification } from "@web3uikit/core";
import { useWeb3Contract } from "react-moralis";
import { useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../constants";

interface contractAddressesInterface {
    [key: string]: string[];
}
const LotteryEntrance = () => {
    const [ticketPrice, setTicketPrice] = React.useState("0");
    const [recentWinner, setRecentWinner] = React.useState("");
    const [numberOfPlayers, setNumberOfPlayers] = React.useState("");
    const addresses: contractAddressesInterface = contractAddresses;
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId: string = parseInt(chainIdHex!).toString();
    const raffleAddress =
        chainId in contractAddresses ? addresses[chainId][0] : null;
    const dispatch = useNotification();
    const {
        // data,
        // error,
        runContractFunction: enterRaffle,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!,
        functionName: "enterRaffle",
        params: {},
        msgValue: ticketPrice,
    });

    const {
        // data,
        // error,
        runContractFunction: getTicketPrice,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!,
        functionName: "getTicketPrice",
    });
    const {
        // data,
        // error,
        runContractFunction: getNumberOfPlayers,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!,
        functionName: "getNumberOfPlayers",
    });
    const {
        // data,
        // error,
        runContractFunction: getRecentWinner,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!,
        functionName: "getRecentWinner",
    });
    const updateUi = async () => {
        const lotteryTicketPrice: string = (await getTicketPrice()) as string;
        setTicketPrice(lotteryTicketPrice);

        const _numberOfPlayers: string = (await getNumberOfPlayers()) as string;
        setNumberOfPlayers(_numberOfPlayers);

        const _recentWinner: string = (await getRecentWinner()) as string;
        setRecentWinner(_recentWinner);
    };

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUi();
        }
    }, [isWeb3Enabled]);

    const handleSuccess = async (tx: any) => {
        await tx.wait(1);
        handleNotification();
        updateUi();
    };
    const handleNotification = () => {
        dispatch({
            title: "Transaction Confirmed",
            message: "You have entered the raffle successfully",
            type: "success",
            position: "topR",
        });
    };
    return (
        <div className="h-72 bg-gradient-to-r from-purple-600 to-blue-600 flex justify-center p-8 mt-5 rounded">
            {raffleAddress ? (
                <div className="flex flex-col items-center gap-2">
                    <p className="text-red-300">
                        NOTE: Lottery will Automatically pick winner after every
                        30sec
                    </p>
                    <p className="text-white text-2xl">
                        Raffle Ticket Price is :{" "}
                        <span className="pl-3 text-blue-400-400 text-3xl">
                            {ethers.utils.formatEther(ticketPrice)} ETH
                        </span>
                    </p>
                    <p className="text-white text-2xl">
                        No of Players in a Lottery :{" "}
                        <span className="pl-3 text-blue-400-400 text-3xl">
                            {numberOfPlayers.toString()}
                        </span>
                    </p>
                    <p className="text-white text-2xl">
                        Most RecentWinner :{" "}
                        <span className="pl-3 text-blue-400-400 text-3xl">
                            {recentWinner.toString()}
                        </span>
                    </p>
                    <Button
                        text="Join Raffle"
                        color="red"
                        theme="colored"
                        size="large"
                        onClick={async () => {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (err) => console.log(err),
                            });
                        }}
                    />
                </div>
            ) : isWeb3Enabled ? (
                <p className="text-4xl">
                    Contract not deployed on this network
                </p>
            ) : (
                <p className="text-4xl">Wallet Not Connected</p>
            )}
        </div>
    );
};

export default LotteryEntrance;
