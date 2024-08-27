"use server";
import axios from 'axios'

export async function getEthPrice () {
  const coinGeckoApiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&x_cg_demo_api_key=${coinGeckoApiKey}`;

  try {
    const response = await axios.get(url);
    const ETHPriceInUSD = response.data["ethereum"].usd;
    return ETHPriceInUSD;
  } catch (error) {
    console.error("Error fetching ETH price:", error);
    return error;
  }
}