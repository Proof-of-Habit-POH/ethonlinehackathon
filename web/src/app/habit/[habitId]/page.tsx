"use client";
import { Suspense, useState, useEffect } from "react";
import AppModal from "@/components/commons/modal";
import ImageUpload from "@/components/commons/image-upload";
import * as actions from "@/actions";
import { Habit, HabitTransaction } from "@prisma/client";
import ChipBar from "@/components/commons/chip";
import {
  Box,
  Tabs,
  Tab,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CheckIcon from "@mui/icons-material/Check";
import BasicButton from "@/components/commons/button";
import {
  habitContractAddress,
  habitContractABI,
} from "@/taxonomy/smartContract";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, ethers } from "ethers";
import { getEthPrice } from "@/actions";

interface HabitDetailsProps {
  params: { habitId: string };
}
interface HabitDetails extends Omit<Habit, "amountPunishment"> {
  amountPunishment: number;
}

type VerifyResultStatus = "pending" | "true" | "false";

export default function HabitDetails({ params }: HabitDetailsProps) {
  // get habit data by habitId
  const [verifyResult, setVerifyResult] =
    useState<VerifyResultStatus>("pending");
  const [habitDetails, setHabitDetails] = useState<HabitDetails | null>(null);
  const [habitTransactions, setHabitTransactions] = useState<
    HabitTransaction[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const habitId = +params.habitId;
  const statusMessage: Record<VerifyResultStatus, string> = {
    pending: "you have not completed the habit",
    true: "you have completed the habit",
    false: "you have not completed the habit",
  };
  const [tab, setTab] = useState("overview");
  const [daysLeft, setDaysLeft] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [betAmount, setBetAmount] = useState(0);
  const [listHabitTransactions, setListHabitTransactions] = useState<any>(null);
  const [isPledgeEnd, setIsPledgeEnd] = useState(false);
  const [returnAmount, setReturnAmount] = useState(0);
  const [isRedeem, setIsRedeem] = useState(false);
  const [sponsorAmount, setSponsorAmount] = useState<number>(0);
  const [ETHPrice, setETHPrice] = useState<number>(2588);
  const [habitOwnerUserWalletAddress, setHabitOwnerUserWalletAddress] = useState<string>("");
  const [provingMethod, setProvingMethod] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchHabitDetails = async () => {
      if (!habitId) {
        return;
      }
      const today = new Date();
      const res = await fetch(`/api/db/habit?habitId=${habitId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      if (res.ok) {
        const data = await res.json();
        console.log("habit details", data);

        // set habit details
        setHabitDetails(() => data);

        // find days left
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        console.log("startDate", startDate);
        // Calculate the difference in milliseconds
        const diffTime = Math.abs(today.getTime() - startDate.getTime());
        // Convert milliseconds to days
        const passedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffDays = data.duration - passedDays;
        if (diffDays < 0) {
          setDaysLeft(0);
        } else {
          setDaysLeft(diffDays);
        }
        setStartDate(startDate);
        setEndDate(endDate);

        // is pledge end or not
        if (today > endDate) {
          setIsPledgeEnd(true);
        }

        // set bet amount
        const betAmountPerDay = data.amountPunishment;
        const betAmount = betAmountPerDay * data.duration;
        setBetAmount(betAmount);

        // set proving method
        setProvingMethod(data.provingMethod);

        // find owner user wallet address
        if (data.userId) {
          const res = await fetch(`/api/db/user?id=${data.userId}`, {
            headers: {
              "Content-Type": "application/json",
            },
            method: "GET",
          });
          if (res.ok) {
            const data = await res.json();
            console.log("user details: ", data);
    
            // set owner of user wallet address
            setHabitOwnerUserWalletAddress(data.user.walletAddress);
            setUsername(data.user.username);
        }
        else {
        console.error("Error can't find userId");
      }
    };
    };
  };

    const fetchHabitTransaction = async () => {
      const res = await fetch(
        `/api/db/habit/habittransaction?habitId=${habitId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        }
      );
      if (res.ok) {
        const data = await res.json();
        console.log("habit transactions", data);
        setHabitTransactions(() => data);
      } else {
        console.error("Error fetching habit transactions:", res.status);
      }
    };

    Promise.all([fetchHabitDetails(), fetchHabitTransaction()]).then(() => {
      setLoading(false);
    });
  }, [habitId]);

  // Fetch today's habit transaction
  useEffect(() => {
    if (habitTransactions) {
      // set list habit transactions
      const habitTransactionsArray: any = [];
      habitTransactions.forEach((habitTransaction) => {
        const date = new Date(habitTransaction.date);
        const formattedDate = date
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replace(/\//g, "-");
        const objectHabitTransaction = {
          id: habitTransaction.id,
          date: formattedDate,
          isCompleted: habitTransaction.isCompleted ? "✅ Success" : "❌ Fail",
        };
        habitTransactionsArray.push(objectHabitTransaction);
      });
      setListHabitTransactions(habitTransactionsArray);

      // find today's habit transaction
      const today = new Date();
      const todayHabitTransaction = habitTransactions.find(
        (habitTransaction) => {
          const habitTransactionDate = new Date(habitTransaction.date);
          return habitTransactionDate.toDateString() === today.toDateString();
        }
      );
      console.log("today's habit transaction status", todayHabitTransaction);
      if (todayHabitTransaction) {
        setVerifyResult(todayHabitTransaction.isCompleted ? "true" : "false");
      }
    }
    
  }, [habitTransactions]);

  // change tab
  const handleTabChange = (event: React.SyntheticEvent, value: string) => {
    setTab(value);
  };

  // pop up alert box
  const [openAlert, setOpenAlert] = useState(false);
  const handleOpenAlert = () => {
    setOpenAlert(true);
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const selfVerifyYes = () => {
    setVerifyResult("true");
    const habitTransaction = fetch("/api/db/habit/habittransaction", {
      method: "POST",
      body: JSON.stringify({
        habitId: habitId,
        isCompleted: true,
      }),
    });
    console.log("Create habit transaction in database", habitTransaction);
  };

  const selfVerifyNo = () => {
    setVerifyResult("false");
    const habitTransaction = fetch("/api/db/habit/habittransaction", {
      method: "POST",
      body: JSON.stringify({
        habitId: habitId,
        isCompleted: false,
      }),
    });
    console.log("Create habit transaction in database", habitTransaction);
  };


  const getETHPriceAPI = async () => {
    try {
      const response = await getEthPrice();
      setETHPrice(response);
      console.log("ETHPrice from API:", response);
    } catch (error) {
      console.error("Error fetching ETH price:", error);
    }
  };

  // smart contract interaction
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  // adjust habitId - 1
  const habitIdOnChain = habitId - 1;

  // smart contract to redeem pledge
  async function redeemPledge() {
    if (!isConnected) throw Error("User disconnected");
    if (!walletProvider) throw Error("Wallet provider not found");
    getETHPriceAPI();

    try {
      // count success days
      let successDays = 0;
      for (let i = 0; i < listHabitTransactions.length; i++) {
        if (listHabitTransactions[i].isCompleted === "✅ Success") {
          successDays++;
        }
      }

      console.log("Redeeming pledge...");
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();

      // The Contract object
      const HabitContract = new Contract(
        habitContractAddress,
        habitContractABI,
        signer
      );
      const HabitContractRedeemPledge = await HabitContract.redeemPledge(
        habitIdOnChain,
        successDays
      );

      const receiptTx = await HabitContractRedeemPledge.wait();
      console.log("Redeem success! ReceiptTx:", receiptTx);

      const returnAmount = receiptTx.logs[0].args.returnAmount;
      const returnAmountNumber = parseInt(returnAmount, 16);
      const returnAmountUSD = Number(
        (returnAmountNumber * ETHPrice).toFixed(2)
      );
      setReturnAmount(returnAmountUSD);
      setIsRedeem(true);
      alert("You got money back:" + returnAmountUSD + " USD on your wallet.");

      // write to database that the habit status is ended
      const res = await fetch(`/api/db/habit?habitId=${habitId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      });
      if (res.ok) {
        console.log("Habit status updated");
      } else {
        console.error("Error updating habit status:", res.status);
      }

      // alert users
      handleOpenAlert();
    } catch (error) {
      alert("something is wrong");
      console.error(error);
    }
  }

  const sponsorPledge = async () => {
    if (!isConnected) throw Error("User disconnected");
    if (!walletProvider) throw Error("Wallet provider not found");
    await getETHPriceAPI();

    const totalAmount = Number((sponsorAmount / ETHPrice).toFixed(8));

    try {
      console.log("Sponsoring pledge...");
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const HabitContract = new Contract(
        habitContractAddress,
        habitContractABI,
        signer
      );
      const HabitContractSponsorPledge = await HabitContract.sponsorPledge(
        habitIdOnChain,
        { value: ethers.parseEther(totalAmount.toString()) }
      );
      const receiptTx = await HabitContractSponsorPledge.wait();
      console.log("Sponsor success! ReceiptTx:", receiptTx);

      // write to database that the habit status is ended
      const res = await fetch(
        `/api/db/sponsorship?habitId=${habitId}&sponsorAmount=${sponsorAmount}&walletAddress=${address}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      );
      if (res.ok) {
        console.log("Sponsorship created");
      } else {
        console.error("Error updating habit status:", res.status);
      }

      // alert users
      handleOpenAlert();
    } catch (error) {
      alert("something is wrong");
      console.error(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-8 bg-lightgraybg">
      
        {loading ? (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <>
        <div className="w-full bg-gradient-to-b from-[#F55951] to-[#EED2CB] rounded-lg text-center">
          <h2 className="text-black text-2xl m-2  font-bold">
            {`"${habitDetails?.name}"`}
          </h2>
          <p className="text-black m-2 text-md">by {username}</p>
        </div>

        <TabContext value={tab}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleTabChange}
              aria-label="lab API tabs example"
              textColor="secondary"
              indicatorColor="secondary"
            >
              <Tab label="Overview" value="overview" />
              {habitOwnerUserWalletAddress == address && (
                <Tab label="Verify" value="verify" />
              )}
              <Tab label="Sponsor" value="sponsor" />
            </TabList>
          </Box>
          <TabPanel value="overview">
            <div className="flex justify-center items-center">
              <Box width="90%" p={2} sx={{ border: "2px solid grey" }}>
                <h2 className="text-l font-bold uppercase text-center my-4">
                  Declaration of my pledge
                </h2>
                <p className="text-md my-4">
                  I am committed to do{" "}
                  <span className="font-bold text-primary capitalize">
                    {habitDetails?.name}
                  </span>{" "}
                  for{" "}
                  <span className="font-bold text-primary">
                    {habitDetails?.duration}
                  </span>{" "}
                  days.
                </p>
                <p className="text-md my-4">
                  If I fail the verification by{" "}
                  <span className="font-bold text-primary lowercase">
                    {habitDetails?.provingMethod}
                  </span>
                  , I will donate{" "}
                  <span className="font-bold text-primary">
                    {habitDetails?.amountPunishment}
                  </span>{" "}
                  USD to the charity for each day I fail.
                </p>
              </Box>
            </div>

            <Divider className="py-4">Status</Divider>

            {verifyResult == "true" && (
              <div>
                <Alert severity="success">Today: ✅ Completed</Alert>
                <p>How many days left: {daysLeft}</p>
                <p>Start Date: {startDate.toDateString()}</p>
                <p>End Date: {endDate.toDateString()}</p>
                <div>Your Bet: {betAmount} USD</div>
              </div>
            )}

            {verifyResult == "false" && (
              <div>
                <p>How many days left: {daysLeft}</p>
                <p>Start Date: {startDate.toDateString()}</p>
                <p>End Date: {endDate.toDateString()}</p>
                <Alert severity="error">Today Status: ❌ You are a LOSER</Alert>
              </div>
            )}

            {verifyResult == "pending" && (
              <div>
                <p>How many days left: {daysLeft}</p>
                <p>Start Date: {startDate.toDateString()}</p>
                <p>End Date: {endDate.toDateString()}</p>
                <Alert severity="info">Today Status: ⏳ Pending</Alert>
                <p>
                  (You are going to lose {habitDetails?.amountPunishment} USD)
                </p>
                <div className="my-2">
                  <BasicButton
                    color="secondary"
                    text="Prove"
                    onClick={() => setTab("verify")}
                  />
                </div>
              </div>
            )}

            <Divider className="py-4">History</Divider>

            {listHabitTransactions?.length === 0 && (
              <div>You have not done anything</div>
            )}

            {listHabitTransactions?.map((habitTransaction: any) => (
              <div key={habitTransaction.id}>
                {habitTransaction.date} | {habitTransaction.isCompleted}
              </div>
            ))}
          </TabPanel>

          <TabPanel value="verify">
            <div>
              {verifyResult === "pending" && !isPledgeEnd && provingMethod === "UPLOAD_IMAGE" && (
                <div>
                  <p>Click here to upload evidence</p>
                  <AppModal header="Upload Evidence">
                    <ImageUpload
                      verifyResult={verifyResult}
                      setVerifyResult={setVerifyResult}
                      habitId={habitId}
                      habitName={habitDetails?.name ?? ""}
                    />
                  </AppModal>
                </div>
              )}

              {verifyResult === "pending" && !isPledgeEnd && provingMethod === "SELF_CONFIRM" && (
                <div>
                  <p className="text-md my-4">Did you do the habit?</p>
                  <BasicButton
                    color="secondary"
                    text="Yes"
                    onClick={selfVerifyYes}
                  />
                  <span className="mx-4">or</span>
                  <BasicButton
                    color="secondary"
                    text="No"
                    onClick={selfVerifyNo}
                  />
                </div>
              )}



              {(verifyResult === "true" || verifyResult === "false") &&
                !isPledgeEnd && (
                  <div>
                    <Alert
                      icon={<CheckIcon fontSize="inherit" />}
                      severity="success"
                    >
                      You already did the verification today
                    </Alert>
                  </div>
                )}

              {isPledgeEnd && !isRedeem && (
                <div>
                  <p>Redeem your money</p>

                  {/* button to redeem money on smart contract */}
                  <BasicButton
                    color="secondary"
                    text="Get My Money Back"
                    onClick={redeemPledge}
                  />

                  <Dialog
                    open={openAlert}
                    onClose={handleCloseAlert}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Congratualtions!"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        You got {returnAmount} USD on your wallet.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseAlert}>Close</Button>
                    </DialogActions>
                  </Dialog>
                </div>
              )}

              {isRedeem && (
                <Alert
                  icon={<CheckIcon fontSize="inherit" />}
                  severity="success"
                >
                  You already redeemed your money
                </Alert>
              )}
            </div>

            {habitOwnerUserWalletAddress !== address && (
              <div>
                <p className="text-md my-2">seriously, this is not your business. Let the owner do verification!</p>
              </div>
            )}
          </TabPanel>

          <TabPanel value="sponsor">
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold">Sponsor your friend</h2>
              <p className="text-md my-2">
                Help them to stay motivated and do the habit
              </p>

              {/* form to sponsor your friend */}
              <div className="my-4">
                <TextField
                  id="outlined-number"
                  label="Sponsor Amount in USD"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={sponsorAmount}
                  onChange={(e) => setSponsorAmount(parseInt(e.target.value))}
                />
              </div>

              {/* button to sponsor on smart contract */}
              <div className="my-4">
                <BasicButton
                  color="secondary"
                  text="Sponsor"
                  onClick={sponsorPledge}
                />
              </div>

              <Dialog
                open={openAlert}
                onClose={handleCloseAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"Done!"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    You sponsored {sponsorAmount} USD to their pledge.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseAlert}>Close</Button>
                </DialogActions>
              </Dialog>
            </div>
          </TabPanel>
        </TabContext>
        </>
      )}
    </main>
  );
}
