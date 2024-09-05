"use client";

import BasicButton from "@/components/commons/button";
import { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  InputLabel,
  TextField,
  Select,
  MenuItem,
  SelectChangeEvent,
  Slider,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { verificationMethods } from "@/taxonomy/verificationMethods";
import {
  habitContractABI,
  habitContractAddress,
} from "@/taxonomy/smartContract";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, ethers } from "ethers";
import { getEthPrice } from "@/actions";
import { CloseFullscreen } from "@mui/icons-material";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { Backdrop, CircularProgress } from "@mui/material";
import Image from "next/image";
import habitCreateComplete from "@/assets/habit-create-complete.png";

export default function CreateNewHabit() {
  const router = useRouter();
  // Add variables to setup state
  const [page, setPage] = useState<number>(0);
  const [verificationMethod, setVerificationMethod] = useState<string>("");
  const [habitName, setHabitName] = useState<string>("");
  const [durationOfHabit, setDurationOfHabit] = useState<number>(21);
  const [betAmountPerDay, setBetAmountPerDay] = useState<number>(1);
  const [friendWalletAddress, setFriendWalletAddress] = useState<string>("");
  const [ETHPrice, setETHPrice] = useState<number>(2588);
  const [newPledgeId, setNewPledgeId] = useState<number>(0);
  const [createdHabitId, setCreatedHabitId] = useState<number>(0);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [loading, setLoading] = useState(false);

  // smart contract interaction
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const getETHPrice = async () => {
    try {
      const response = await getEthPrice();
      setETHPrice(response);
      console.log("ETHPrice from API:", response);
    } catch (error) {
      console.error("Error fetching ETH price:", error);
    }
  };

  async function createNewPledge() {
    if (!isConnected) throw Error("User disconnected");
    if (!walletProvider) throw Error("Wallet provider not found");

    const totalAmount = Number(
      ((betAmountPerDay * durationOfHabit) / ETHPrice).toFixed(8)
    );

    try {
      console.log("creating new pledge...");
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();

      // The Contract object
      const HabitContract = new Contract(
        habitContractAddress,
        habitContractABI,
        signer
      );
      const HabitContractCreateNewPledge = await HabitContract.createNewPledge(
        durationOfHabit,
        { value: ethers.parseEther(totalAmount.toString()) }
      );

      console.log("Created success!");
      setLoading(true);

      const receiptTx = await HabitContractCreateNewPledge.wait();
      console.log("ReceiptTx:", receiptTx);
      const pledgeId = receiptTx.logs[0].args.id;
      const pledgeIdNumber = parseInt(pledgeId, 16);
      setNewPledgeId(pledgeIdNumber);
      console.log("PledgeId:", pledgeIdNumber);

      //create new habitId in database
      const res = await fetch(`/api/db/habit`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          habitName,
          verificationMethod,
          durationOfHabit,
          betAmountPerDay,
          address,
        }),
      });
      if (res.ok) {
        // get habitId from response
        const createdHabit = await res.json();
        console.log("Habit created: ", createdHabit);
        setCreatedHabitId(createdHabit.data.id);
      } else {
        console.error("Error creating habit:", res.status);
      }
      setLoading(false);
      setPage(page + 1);
    } catch (error) {
      console.error(error);
    }
  }

  // buttons handle
  const clickNextPage = () => {
    setPage(page + 1);
  };

  const clickPreviousPage = () => {
    setPage(page - 1);
  };
  const handleSelectVerificationMethod = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    console.log("verificationMethod: ", e.currentTarget.id);
    setVerificationMethod(e.currentTarget.id);
    clickNextPage();
    getETHPrice();
  };
  const shareMyPledgeButton = () => {
    const url = `${window.location.origin}/habit/${createdHabitId}`;
    console.log("URL to be copied: ", url);
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setButtonClicked(() => true);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
    router.push(`/habit/${createdHabitId}`);
  };
  // check first if user is logged in
  useEffect(() => {
    console.log("address: inside create habit useeffect", address);
    if (!address) {
      redirect("/login");
    }
  }, [address]);

  return (
    <>
      <main className="flex min-h-[600px] flex-col items-center p-8">
        {/* first page, choose verification method */}
        {page === 0 && (
          <div>
            <h1 className="text-4xl font-bold my-4">Create New Habit</h1>
            <div className="text-md my-4">How do you want to verify?</div>
            <div className="flex flex-col gap-4 my-8">
              {verificationMethods.map((method, index) => (
                <button
                  key={index}
                  id={method.name}
                  onClick={handleSelectVerificationMethod}
                  className="w-full p-4 my-2 flex flex-col gap-2 bg-gradient-to-r from-[#EED2CB] to-[#F1E8E6] rounded-lg shadow-md"
                >
                  <div className="text-lg font-bold">{method.name}</div>
                  <div className="text-sm text-start">{method.description}</div>
                  <div className="text-lg font-bold">&#8594;</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* second page, enter habit details */}
        {page === 1 && (
          <div>
            <h1 className="text-4xl font-bold my-4">
              What are you going to do?
            </h1>
            <p className="text-md my-4">
              I will do{" "}
              <span className="font-bold text-primary capitalize">
                {verificationMethod}
              </span>{" "}
              to verify that I will
            </p>
            <TextField
              label="your habit"
              color="primary"
              helperText="eg. Wake up 4 AM, Read 20 pages, Exercise"
              value={habitName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setHabitName(event.target.value);
              }}
            />
            <div className="my-8">
              <Divider />
            </div>

            <div>
              <p>for </p>
            </div>
            <div>
              <Slider
                aria-label="Always visible"
                defaultValue={21}
                valueLabelDisplay="auto"
                step={1}
                min={1}
                max={30}
                value={durationOfHabit}
                onChange={(_: Event, newValue: number | number[]) => {
                  setDurationOfHabit(newValue as number);
                }}
                color="secondary"
              />
            </div>
            <p>days</p>

            <div className="my-8">
              <Divider />
            </div>

            <p className="text-md my-4">Bet Amount Per Day</p>

            <TextField
              id="outlined-number"
              label="USD"
              type="number"
              color="primary"
              helperText="It will charge you this amount for each day you fail"
              InputLabelProps={{
                shrink: true,
              }}
              value={betAmountPerDay}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setBetAmountPerDay(parseFloat(event.target.value));
              }}
            />

            {/* button to go next or back */}
            <div className="flex justify-between my-8">
              <IconButton onClick={clickPreviousPage} aria-label="go back">
                <ArrowBackIcon />
              </IconButton>
              <BasicButton
                text="Next"
                onClick={clickNextPage}
                color="secondary"
              />
            </div>
          </div>
        )}

        {/* third page, confirm pledge */}
        {page === 2 && (
          <div>
            {loading ? (
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loading}
              >
                <CircularProgress color="inherit" />
                <p className="m-3 text-md my-4">
                  Waiting on-chain transaction...
                </p>
              </Backdrop>
            ) : (
              <div>
                <h1 className="text-xl font-bold my-4">Hey Loser 😛</h1>
                <p className="text-md my-4">
                  You have pledged to do{" "}
                  <span className="font-bold text-primary capitalize">
                    {habitName}
                  </span>{" "}
                  for{" "}
                  <span className="font-bold text-primary">
                    {durationOfHabit}
                  </span>{" "}
                  days.
                </p>
                <p className="text-md my-4">
                  If you fail the verification by{" "}
                  <span className="font-bold text-primary lowercase">
                    {verificationMethod}
                  </span>
                  , you will lose{" "}
                  <span className="font-bold text-primary">
                    {betAmountPerDay}
                  </span>{" "}
                  USD to the charity for each day I fail. And the rest of the
                  money will return to your wallet.
                </p>
                <p className="text-md my-4">
                  If you complete the habit every single day, you will get all
                  the money + sponsored money from your love ones.
                </p>
                <p className="text-md my-4">
                  Are you sure that you are ready to stop being such a loser and
                  pledge by submitting your USDT on habit smart contract?
                </p>

                <div className="flex justify-between my-8">
                  <IconButton
                    onClick={clickPreviousPage}
                    aria-label="I'm a loser"
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <BasicButton
                    text="Shut Up and Take My Money"
                    onClick={createNewPledge}
                    color="secondary"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {page === 3 && (
          <div className="flex flex-col gap-4 items-center">
            <h1 className="text-4xl font-bold my-4">Congratulations!</h1>
            <p className="text-md my-4">
              Now you can ask your love ones to sponsor your pledge. If you can
              complete every single day, you will get their sponsored gift. If
              not, the money will return to them.
            </p>
            <Image
              src={habitCreateComplete}
              alt="sponsor"
              width={300}
              height={300}
            />

            <BasicButton
              text={
                buttonClicked ? "Copied link to clipboard" : "Share My Pledge"
              }
              onClick={() => {
                shareMyPledgeButton();
                setButtonClicked(true);
              }}
              color="secondary"
            />
          </div>
        )}
      </main>
    </>
  );
}
