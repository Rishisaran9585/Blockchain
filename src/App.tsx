import React, { useState, useEffect, ReactNode } from "react";
import {
  Layout,
  Card,
  Input,
  Button,
  Statistic,
  Row,
  Col,
  Avatar,
  Form,
  Menu,
  Dropdown,
  Space,
  Select,
  Typography,
} from "antd";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LogoutOutlined, WalletOutlined } from "@ant-design/icons";
import axiosInstance from "./config";
import Web3 from "web3";
const { ethers } = require("ethers");
import BigNumber from "bignumber.js";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// Set up the web3 instance
let web3: Web3 | undefined;
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  web3 = new Web3(window.ethereum);
  console.log("window.ethereum");
} else {
  web3 = new Web3(
    new ethers.providers.JsonRpcProvider(
      "https://testnet-rpc2.monad.xyz/52227f026fa8fac9e2014c58fbf5643369b3bfc6"
    )
  );
  console.log("monad");
}

const muContractId = "0xCc4495066ccBa03bd2Fe3ee8DA411A33dbE82938";

const muContractAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_priceFeed",
        type: "address",
      },
      {
        internalType: "address",
        name: "_muBond",
        type: "address",
      },
      {
        internalType: "address",
        name: "_treasury",
        type: "address",
      },
      {
        internalType: "address",
        name: "_monUsdcPool",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bondAmount",
        type: "uint256",
      },
    ],
    name: "Created",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bondAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
    ],
    name: "Redeemed",
    type: "event",
  },
  {
    inputs: [],
    name: "createWithMON",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
    ],
    name: "createWithUSDC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "depositAum",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMonBondPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMonUsdcPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "issuedTokenNo",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "monUsdcPool",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "muBond",
    outputs: [
      {
        internalType: "contract MuBOND",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "noOfCreations",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "noOfRedemptions",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "priceFeed",
    outputs: [
      {
        internalType: "contract IMuDigitalPriceFeed",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "treasury",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "updateMonUsdcPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const muPriceFeedId = "0x87d28Ff0a712b28D2f89B228118Af5e4F84045B4";

const muPriceFeedAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_initialOwner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_tokenAddr",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "_decimals",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_initialPx",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "feedStatus",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestPriceInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "shareToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_stt",
        type: "uint256",
      },
    ],
    name: "updateFeedStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_px",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_timestamp",
        type: "uint256",
      },
    ],
    name: "updatePrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const muBondId = "0x0EfeD4D9fB7863ccC7bb392847C08dCd00FE9bE2";
const muBondAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "addMinter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "removeMinter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_ownerAddr",
        type: "address",
      },
    ],
    name: "setOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MINTER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const { Header, Content } = Layout;
const { Text } = Typography;

interface EllipsisMiddleProps {
  suffixCount: number;
  prefixCount: number;
  children: ReactNode;
}

const EllipsisMiddle: React.FC<EllipsisMiddleProps> = ({ suffixCount, prefixCount, children }) => {
  if (!children || typeof children !== 'string' || children.length <= suffixCount + 5) {
    return <Text>{children}</Text>; // Return full text if it's too short for ellipsis
  }

  const start = children.slice(0, prefixCount); // Keep the first 5 characters
  const suffix = children.slice(-suffixCount); // Keep the last `suffixCount` characters

  return (
    <Text style={{ maxWidth: "100%" }} ellipsis={{ suffix }}>
      {start}....
    </Text>
  );
};

const App = () => {
  const [tvldata, setTvldata] = useState([]);
  const [apydata, setApydata] = useState([]);
  const [amount, setAmount] = useState(0);
  const [cost, setCost] = useState(0);
  const [account, setAccount] = useState("");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [apy, setApy] = useState(0);
  const [token, setToken] = useState("MON");
  const [muBondBalance, setMuBondBalance] = useState(0);
  const [muBondBalanceInUSD, setMuBondBalanceInUSD] = useState(0);
  const [monUSDPrice, setMonUSDPrice] = useState(0);
  const [monBondPrice, setMonBondPrice] = useState(0);
  const [muBondBalanceView, setMuBondBalanceView] = useState(0);
  const [muBondBalanceUSDView, setMuBondBalanceUSDView] = useState(0);
  const [tvlView, setTvlView] = useState(0);

  useEffect(() => {
    // Convert muBondBalance to a BigNumber and divide by 1e18
    const muBondBalanceView = new BigNumber(muBondBalance).dividedBy(
      new BigNumber(1e18)
    );

    // Set the converted value to state
    setMuBondBalanceView(muBondBalanceView.toNumber());
  }, [muBondBalance]);

  useEffect(() => {
    // Convert muBondBalance to a BigNumber and divide by 1e18
    const tvlView = new BigNumber(totalSupply)
      .multipliedBy(new BigNumber(currentPrice))
      .dividedBy(new BigNumber(1e18));

    // Set the converted value to state
    setTvlView(tvlView.toNumber());
  }, [totalSupply, currentPrice]);

  // Conver the balance to USD
  useEffect(() => {
    // Convert muBondBalance to a BigNumber and divide by 1e18
    const tmuBondBalance = new BigNumber(muBondBalance).dividedBy(
      new BigNumber(1e18)
    );
    const tmonUSDPrice = new BigNumber(monUSDPrice).dividedBy(
      new BigNumber(1e6)
    );
    const muBondBalanceUSDView = tmuBondBalance.multipliedBy(tmonUSDPrice);
    // Set the converted value to state
    setMuBondBalanceUSDView(muBondBalanceUSDView.toNumber());
  }, [muBondBalance, monUSDPrice]);

  // Convert the amount to muBonds
  useEffect(() => {
    if (token === "MON") {
      // Convert amountOfMON to a BigNumber with 18 decimals
      const amountInWei = new BigNumber(amount).multipliedBy(
        new BigNumber(10).exponentiatedBy(18)
      );
      // Get the MON-BOND price (ensure it returns a BigNumber)
      const tmonBondPrice = new BigNumber(monBondPrice);

      // Perform the calculation using BigNumber
      const muBondAmount = amountInWei.dividedBy(tmonBondPrice);
      setCost(muBondAmount.toNumber());
    } else {
      // Convert amountOfMON to a BigNumber with 18 decimals
      const amountInWei = new BigNumber(amount).multipliedBy(
        new BigNumber(10).exponentiatedBy(6)
      );
      // Get the MON-BOND price (ensure it returns a BigNumber)
      const tmonUSDPrice = new BigNumber(monUSDPrice);

      // Perform the calculation using BigNumber
      const muBondAmount = amountInWei.dividedBy(tmonUSDPrice);
      setCost(muBondAmount.toNumber());
    }
  }, [amount, monBondPrice, token, monUSDPrice]);

  const handleTokenChange = (value: string) => {
    setToken(value);
    console.log("Selected token:", value);
  };

  const menu = (
    <Menu>
      <Menu.Item key="token">
        <Space>
          <img src="/images/MetaMask_Fox.png" alt="muBond" width="15" />
          <EllipsisMiddle suffixCount={4} prefixCount={7}>
            {account}
          </EllipsisMiddle>
        </Space>
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined style={{ color: "orange" }} />}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  const handleAmountChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let newAmount = parseFloat(e.target.value);
    newAmount = newAmount || 0;
    setAmount(newAmount);
  };

  interface Record {
    date: string;
    value: number;
  }

  const fetchApy = () => {
    axiosInstance
      .get("wallet/apy")
      .then((res) => {
        console.log("apy:", res.data.apy);
        setApy(res.data.apy || 0);
      })
      .catch((err) => {
        console.log(err);
      });

    axiosInstance
      .get("wallet/tvl-history")
      .then((res) => {
        if (res.data.records) {
          let chartData = res.data.records.map((record: Record) => {
            return {
              name: record.date,
              value: record.value,
            };
          });
          setTvldata(chartData);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    axiosInstance
      .get("wallet/apy-history")
      .then((res) => {
        if (res.data.records) {
          let chartData = res.data.records.map((record: Record) => {
            return {
              name: record.date,
              value: record.value,
            };
          });
          setApydata(chartData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const requestAccessLog = async () => {
    if (window.ethereum) {
      try {
        // Request account access if needed
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const userAddress = accounts[0];

        // Call the API with the userAddress
        axiosInstance
          .post("wallet/access-log", { userAddress })
          .then((res) => {
            console.log("Access log response:", res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  const createMarket = async () => {
    if (token === "MON") {
      await createWithMON();
    } else {
      await createWithUSDC();
    }
  };

  async function connectWallet() {
    try {
      if (
        typeof window === "undefined" ||
        typeof window.ethereum === "undefined"
      ) {
        return console.log("MetaMask is not installed.");
      }

      if (!web3) return;
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0)
        return console.log("Please connect to MetaMask.");

      setAccount(accounts[0]);
    } catch (e) {
      if (e instanceof Error && e.message === "User denied access to account information.") {
        // Handle MetaMask permission denial here.
      } else {
        console.error("Failed:", e);
      }
    }
  }

  function formatCurrency(amount: string) {
    return Number(amount)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  }

  async function getMonBondPrice() {
    try {
      if (
        typeof window === "undefined" ||
        typeof window.ethereum === "undefined"
      ) {
        return console.log("MetaMask is not installed.");
      }

      if (!web3) return;

      // Get the deployed smart contract instance
      let bondPriceContractInstance;

      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0)
        return console.log("Please connect to MetaMask.");

      // Initialize the contract instance
      bondPriceContractInstance = new web3.eth.Contract(
        muContractAbi, // Replace with the ABI of the contract containing getMonBondPrice
        muContractId // Replace with the address of the contract
      );

      // Call the getMonBondPrice function
      const price: string = await bondPriceContractInstance.methods
        .getMonBondPrice()
        .call({ from: accounts[0] });

      // Convert the price to a readable format (if necessary)
      // For example, if the price is returned in a smaller unit (e.g., 6 decimals), divide by 1e6
      //   const formattedPrice = Number(price) / 1e6; // Adjust the divisor based on the token's decimals

      //   console.log(`MON-BOND Price: ${formattedPrice}`);
      //   return price;
      setMonBondPrice(Number(price));
    } catch (e) {
      if (e instanceof Error && e.message === "User denied access to account information.") {
        // Handle MetaMask permission denial here.
      } else {
        console.error("Failed:", e);
      }
    }
  }

  async function getMonUsdcPrice() {
    try {
      if (
        typeof window === "undefined" ||
        typeof window.ethereum === "undefined"
      ) {
        return console.log("MetaMask is not installed.");
      }

      if (!web3) return;

      // Get the deployed smart contract instance
      let priceContractInstance;

      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0)
        return console.log("Please connect to MetaMask.");

      // Initialize the contract instance
      priceContractInstance = new web3.eth.Contract(
        muContractAbi, // Replace with the ABI of the contract containing getMonUsdcPrice
        muContractId // Replace with the address of the contract
      );

      // Call the getMonUsdcPrice function
      const price: string = await priceContractInstance.methods
        .getMonUsdcPrice()
        .call({ from: accounts[0] });
      //   let standardPrice = Number(price) / 1e6;

      setMonUSDPrice(Number(price));
    } catch (e) {
      if (e instanceof Error && e.message === "User denied access to account information.") {
        // Handle MetaMask permission denial here.
      } else {
        console.error("Failed:", e);
      }
    }
  }

  async function getMuBondBalance() {
    try {
      if (
        typeof window === "undefined" ||
        typeof window.ethereum === "undefined"
      ) {
        return console.log("MetaMask is not installed.");
      }

      if (!web3) return;

      // Get the deployed smart contract instance
      let muContractInstance;

      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0)
        return console.log("Please connect to MetaMask.");

      // Set the current account
      const currentAccount = accounts[0];

      // Initialize the contract instance
      muContractInstance = new web3.eth.Contract(muBondAbi, muBondId);

      // Call the balanceOf function to get the balance of the current account
      const balance: string = await muContractInstance.methods
        .balanceOf(currentAccount)
        .call({ from: currentAccount });

      // Convert the balance from Wei to Ether (assuming the token uses 18 decimals)
      //   const balanceInEther = web3.utils.fromWei(balance, "ether");
      setMuBondBalance(Number(balance));
    } catch (e) {
      if (e instanceof Error && e.message === "User denied access to account information.") {
        // Handle MetaMask permission denial here.
      } else {
        console.error("Failed:", e);
      }
    }
  }

  async function createWithMON() {
    try {
      if (
        typeof window === "undefined" ||
        typeof window.ethereum === "undefined"
      ) {
        return console.log("MetaMask is not installed.");
      }

      if (!web3) return;

      // Get the deployed smart contract instance
      let muContractInstance;

      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0)
        return console.log("Please connect to MetaMask.");

      //setAccount(accounts[0]);

      muContractInstance = new web3.eth.Contract(muContractAbi, muContractId);

      // Call the create() method on your contract
      let result;
      let value = web3.utils.toWei(String(amount), "ether");
      await muContractInstance.methods
        .createWithMON()
        .send({ from: accounts[0], value })
        .then((response) => {
          console.log(response);
          return response;
        })
        .catch((error) => {
          alert("Error while calling 'create' function");
          throw error;
        });
    } catch (e) {
      if (e instanceof Error && e.message === "User denied access to account information.") {
        // Handle MetaMask permission denial here.
      } else {
        console.error("Failed:", e);
      }
    }
  }

  async function createWithUSDC() {
    try {
      if (
        typeof window === "undefined" ||
        typeof window.ethereum === "undefined"
      ) {
        return console.log("MetaMask is not installed.");
      }

      if (!web3) return;

      // Request account access if needed
      // await window.ethereum.request({ method: "eth_requestAccounts" });

      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0)
        return console.log("Please connect to MetaMask.");

      //setAccount(accounts[0]);

      let muContractInstance;
      // Get the deployed smart contract instance
      muContractInstance = new web3.eth.Contract(muContractAbi, muContractId);

      const usdcValue = web3.utils.toWei(String(amount), "mwei");
      console.log("usdcValue:", usdcValue);

      await muContractInstance.methods
        .createWithUSDC(usdcValue)
        .send({
          from: accounts[0],
        })
        .then((response) => {
          console.log(response);
          return response;
        })
        .catch((error) => {
          alert("Error while calling 'create' function");
          throw error;
        });
    } catch (e) {
      if (e instanceof Error && e.message === "User denied access to account information.") {
        // Handle MetaMask permission denial here.
      } else {
        console.error("Failed:", e);
      }
    }
  }

  async function currentPriceInfo() {
    try {
      if (
        typeof window === "undefined" ||
        typeof window.ethereum === "undefined"
      ) {
        return console.log("MetaMask is not installed.");
      }
      // Request account access if needed
      // await window.ethereum.request({ method: "eth_requestAccounts" });

      if (!web3) return;

      // Get the deployed smart contract instance
      let muContractInstance;

      muContractInstance = new web3.eth.Contract(muPriceFeedAbi, muPriceFeedId);

      // Call the currentPriceInfo() method on your contract
      let result = await muContractInstance.methods
        .latestPriceInfo()
        .call()
        .then((response) => {
          console.log(response);
          return response;
        })
        .catch((error) => {
          console.log(error);
        });
      console.log("result:", result);

      if (result && result[0] && result[1]) {
        setCurrentPrice((Number(result[0]) / Number(result[1])).toFixed(2));
      }
    } catch (e) {
      if (e instanceof Error && e.message === "User denied access to account information.") {
        // Handle MetaMask permission denial here.
      } else {
        console.error("Failed:", e);
      }
    }
  }

  async function getTotalSupply() {
    try {
      if (
        typeof window === "undefined" ||
        typeof window.ethereum === "undefined"
      ) {
        return console.log("MetaMask is not installed.");
      }
      // Request account access if needed
      // await window.ethereum.request({ method: "eth_requestAccounts" });

      if (!web3) return;
      let muContractInstance;
      muContractInstance = new web3.eth.Contract(muBondAbi, muBondId);

      // Call the totalSupply() method on your contract
      let result = await muContractInstance.methods
        .totalSupply()
        .call()
        .then((response) => {
          console.log(response);
          return response;
        })
        .catch((error) => {
          console.log(error);
        });
      // console.log("totalSupply:", result);
      setTotalSupply(result || 0);
    } catch (e) {
      if (e instanceof Error && e.message === "User denied access to account information.") {
        // Handle MetaMask permission denial here.
      } else {
        console.error("Failed:", e);
      }
    }
  }

  async function monToMuBond(amountOfMON) {
    try {
      // Convert amountOfMON to a BigInt with 18 decimals
      const amountInWei = BigInt(amountOfMON) * BigInt(1e18);

      // Get the MON-BOND price (ensure it returns a BigInt)
      // const monBondPrice = await getMonBondPrice();

      // Perform the calculation using BigInt
      const muBondAmount = amountInWei / BigInt(monBondPrice);

      // Convert the result back to a regular number (if needed)
      return Number(muBondAmount);
    } catch (e) {
      console.error("Error in monToMuBond:", e);
      throw e;
    }
  }

  async function usdToMuBond(amountOfUSDC) {
    try {
      // Convert amountOfUSDC to a BigNumber with 6 decimals (USDC uses 6 decimals)
      const amountInUnits = new BigNumber(amountOfUSDC).multipliedBy(1e6);

      // Get the MON-USDC price (ensure it returns a BigNumber)
      const monUsdcPrice = new BigNumber(monUSDPrice);

      // Perform the calculation using BigNumber
      const muBondAmount = amountInUnits.dividedBy(monUsdcPrice);

      // Convert the result to a number (if needed)
      return muBondAmount.toNumber();
    } catch (e) {
      console.error("Error in usdToMuBond:", e);
      throw e;
    }
  }

  useEffect(() => {
    connectWallet();
    currentPriceInfo();
    getTotalSupply();
    fetchApy();
    getMuBondBalance();
    getMonUsdcPrice();
    getMonBondPrice();
    // requestAccessLog();
  }, []); // Add dependencies if needed

  const formatNumber = (num, decimal) => {
    let d = decimal == undefined ? 4 : decimal;
    num = Number(num);
    if (num >= 1e9) {
      return (num / 1e9).toFixed(d) + " B";
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(d) + " M";
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(d) + " K";
    } else {
      return num.toFixed(d);
    }
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "#0d0f1a",
        color: "#fff",
        backgroundImage: "url('/images/Ellipse 4.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Header
        style={{
          height: "auto",
          background: "transparent",
          padding: "20px 50px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          flexWrap: "wrap",
        }}
      >
        <Row
          justify={"space-between"}
          style={{ width: "100%" }}
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        >
          <Col
            xs={{ span: 24, order: 1 }}
            sm={{ span: 12, order: 1 }}
            md={{ span: 12, order: 1 }}
            lg={{ span: 6, order: 1 }}
          >
            <img
              src="/images/MuDigital-Logo-White.png"
              width={200}
              alt="logo"
            />
          </Col>
          <Col
            xs={{ span: 24, order: 3 }}
            sm={{ span: 24, order: 3 }}
            md={{ span: 24, order: 3 }}
            lg={{ span: 12, order: 2 }}
          >
            <Row gutter={[16, 32]} justify="center">
              {[
                {
                  title: "TVL",
                  value: "$" + formatNumber(tvlView),
                },
                { title: "APY", value: apy + "%" },
                {
                  title: "Simulated Price",
                  value: Number(currentPrice) + " $Mu",
                },
              ].map((item, index) => (
                <Col xs={24} sm={8} key={index}>
                  <Card
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      borderColor: "#685160",
                    }}
                  >
                    <Statistic
                      title={
                        <span style={{ color: "#acaaba" }}>{item.title}</span>
                      }
                      value={item.value}
                      valueStyle={{ color: "#fff" }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
          <Col
            xs={{ span: 24, order: 2 }}
            sm={{ span: 12, order: 2 }}
            md={{ span: 12, order: 2 }}
            lg={{ span: 6, order: 3 }}
          >
            <Space
              align="center"
              size={10}
              style={{ width: "100%", justifyContent: "end" }}
            >
              {" "}
              {account ? (
                <>
                  <div
                    style={{
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <h3
                      style={{
                        color: "#fff",
                        margin: "2px 0px 5px 0px",
                        lineHeight: "normal",
                      }}
                    >
                      {formatCurrency(muBondBalanceView)}{" "}
                      <span style={{ color: "#ed6830" }}>MUBONDS</span>
                    </h3>
                    <h5
                      style={{
                        color: "#fff",
                        margin: 0,
                        lineHeight: "normal",
                        textAlign: "right",
                      }}
                    >
                      {formatCurrency(muBondBalanceUSDView)}{" "}
                      <span style={{ color: "#ed6830" }}>USD</span>
                    </h5>
                  </div>
                  <Dropdown overlay={menu} placement="bottomRight" arrow={true}>
                    <Avatar
                      size={40}
                      style={{ backgroundColor: "#ed6830", cursor: "pointer" }}
                    >
                      <WalletOutlined style={{ color: "white" }} />
                    </Avatar>
                  </Dropdown>
                </>
              ) : (
                // <Button
                //   type="primary"
                //   size="large"
                //   shape="round"
                //   block
                //   style={{ borderColor: "#ed672e", backgroundColor: "#ed672e" }}
                // >
                //   Connect
                // </Button>
                <ConnectButton />
              )}
            </Space>
          </Col>
        </Row>
      </Header>
      <Content style={{ padding: "20px 10%" }}>
        <Row justify="center">
          <Col xs={24} sm={16} md={12} lg={8}>
            <Card
              variant={false}
              style={{
                textAlign: "left",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "10px",
                padding: "20px",
                margin: "60px 0",
                position: "relative",
              }}
            >
              <h1 style={{ color: "#fff", margin: 0, lineHeight: "normal" }}>
                MINT
                <br />
                MUBONDS
              </h1>
              <br />
              <Form layout="vertical">
                <Form.Item
                  label={<span style={{ color: "#fff" }}>You'll pay</span>}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Input
                      style={{
                        flex: 1,
                        background: "rgba(0, 0, 0, 0.8)",
                        color: "#fff",
                      }}
                      size="large"
                      value={amount || ""}
                      onChange={handleAmountChange}
                    />
                    <Select
                      style={{ width: 100 }}
                      className="custom-select"
                      defaultValue="MON"
                      value={token}
                      onChange={handleTokenChange}
                      size="large"
                      options={[
                        {
                          value: "MON",
                          label: (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                              }}
                            >
                              <img
                                src="/images/Mon.png"
                                alt="MON"
                                width="20"
                                height="20"
                              />
                              MON
                            </div>
                          ),
                        },
                        {
                          value: "USDC",
                          label: (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                              }}
                            >
                              <img
                                src="/images/Mon.png"
                                alt="MON"
                                width="20"
                                height="20"
                              />
                              USDC
                            </div>
                          ),
                        },
                      ]}
                    />
                  </div>
                </Form.Item>

                <p style={{ color: "#aaa", marginBottom: "20px" }}>
                  You'll get <strong>{cost} muBonds</strong>
                </p>

                <Button
                  type="primary"
                  size="large"
                  onClick={createMarket}
                  shape="round"
                  block
                  style={{ borderColor: "#ed672e", backgroundColor: "#ed672e" }}
                >
                  MINT
                </Button>
                <Button
                  type="default"
                  size="large"
                  style={{
                    position: "absolute",
                    top: "0px",
                    right: "0px",
                    borderTopLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    borderBottomLeftRadius: "10px",
                    background: "linear-gradient(135deg, #0e1b44, #182a5d)",
                    color: "#fff",
                    border: "none",
                    width: 150,
                  }}
                >
                  REDEEM
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ margin: "40px 0px" }}>
          <Col xs={24} md={12}>
            <Card
              variant={false}
              style={{
                backgroundColor: "#040b21",
                color: "#fff",
                borderColor: "#040b21",
              }}
            >
              <span>TVL</span>
              <h2 style={{ margin: 0 }}>
                $
                {tvldata &&
                  tvldata.length > 0 &&
                  formatNumber(tvldata[tvldata.length - 1].value, 0)}
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={tvldata}
                  style={{
                    backgroundColor: "#040b21",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  <defs>
                    <linearGradient id="colorTvL" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#19323b" stopOpacity={1} />
                      <stop
                        offset="95%"
                        stopColor="#19323b"
                        stopOpacity={0.3}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#1d2538"
                  />
                  <XAxis dataKey="name" stroke="#1d2538" />
                  <YAxis stroke="#1d2538" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#6fd195"
                    fill="url(#colorTvL)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card
              variant={false}
              style={{
                backgroundColor: "#040b21",
                color: "#fff",
                borderColor: "#040b21",
              }}
            >
              <span>APY</span>

              <h2 style={{ margin: 0 }}>
                {apydata &&
                  apydata.length > 0 &&
                  formatNumber(apydata[apydata.length - 1].value, 0)}
                %
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={apydata}
                  style={{
                    backgroundColor: "#040b21",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  <defs>
                    <linearGradient id="colorTvL" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#19323b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#19323b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#1d2538"
                  />
                  <XAxis dataKey="name" stroke="#1d2538" />
                  <YAxis stroke="#1d2538" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#6fd195"
                    fill="url(#colorTvL)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default App;
