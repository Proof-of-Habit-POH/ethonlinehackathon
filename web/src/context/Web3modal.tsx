
// context/Web3Modal.tsx

'use client'

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'
import { getCsrfToken, signIn, signOut, getSession } from "next-auth/react";
import type {
  SIWEVerifyMessageArgs,
  SIWECreateMessageArgs,
  SIWESession,
} from "@web3modal/siwe";
import { createSIWEConfig, formatMessage } from "@web3modal/siwe";
import { verifySignature } from '@web3modal/siwe'

interface SIWEConfig {
  // Required
  getNonce: () => Promise<string>
  createMessage: (args: SIWECreateMessageArgs) => string
  verifyMessage: (args: SIWEVerifyMessageArgs) => Promise<boolean>
  getSession: () => Promise<SIWESession | null>
  signOut: () => Promise<boolean>

  // Optional
  onSignIn?: (session?: SIWESession) => void
  onSignOut?: () => void
  // Defaults to true
  enabled?: boolean
  // In milliseconds, defaults to 5 minutes
  nonceRefetchIntervalMs?: number
  // In milliseconds, defaults to 5 minutes
  sessionRefetchIntervalMs?: number
  // Defaults to true
  signOutOnDisconnect?: boolean
  // Defaults to true
  signOutOnAccountChange?: boolean
  // Defaults to true
  signOutOnNetworkChange?: boolean
}


// 1. Your WalletConnect Cloud project ID
export const projectId = 'e9d008ea001059749e0784bf0a0b032b'

// 2. Set chains
const testnet = {
  chainId: 2810,
  name: 'Morph Holesky Testnet',
  currency: 'ETH',
  explorerUrl: 'https://explorer-holesky.morphl2.io',
  rpcUrl: 'https://rpc-quicknode-holesky.morphl2.io'
  // chainId: 421614,
  // name: 'Arbitrum Sepolia',
  // currency: 'ETH',
  // explorerUrl: 'https://sepolia.arbiscan.io',
  // rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc'
}

// 3. Create a metadata object
const metadata = {
  name: 'proof of habit',
  description: 'AppKit Example',
  url: 'localhost:3000', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: '...', // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
})


// Sign In With Ethereum
const siweConfig = createSIWEConfig({
  getMessageParams: async () => ({
    domain: typeof window !== "undefined" ? window.location.host : "",
    uri: typeof window !== "undefined" ? window.location.origin : "",
    chains: [testnet.chainId],
    statement: "Please sign with your account",
  }),
  createMessage: ({ address, ...args }: SIWECreateMessageArgs) =>
    formatMessage(args, address),
  getNonce: async () => {
    const nonce = await getCsrfToken();
    if (!nonce) {
      throw new Error("Failed to get nonce!");
    }

    return nonce;
  },
  getSession: async () => {
    const session = await getSession();
    if (!session) {
      throw new Error("Failed to get session!");
    }

    const { address, chainId } = session as unknown as SIWESession;

    return { address, chainId };
  },
  verifyMessage: async ({ message, signature }: SIWEVerifyMessageArgs) => {
    try {
      const success = await signIn("credentials", {
        message,
        redirect: false,
        signature,
        callbackUrl: "/protected",
      });

      return Boolean(success?.ok);
    } catch (error) {
      return false;
    }
  },
  signOut: async () => {
    try {
      await signOut({
        redirect: false,
      });

      return true;
    } catch (error) {
      return false;
    }
  },
});




// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  siweConfig,
  chains: [testnet],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
  themeVariables: {
    '--w3m-color-mix': '#371D32',
    '--w3m-color-mix-strength': 40
  }
})

export function AppKit({ children }) {
    return children
  }