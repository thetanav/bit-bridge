import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bitcoin } from "lucide-react";

function BtcTicker() {
  const [price, setPrice] = useState(null);

  const fetchPrice = async () => {
    try {
      const res = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
      );
      setPrice(res.data.bitcoin.usd);
    } catch (err) {
      console.error("Failed to fetch BTC price:", err);
    }
  };

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 10000); // update every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold p-2 flex items-center gap-2 overflow-hidden whitespace-nowrap">
      <Bitcoin className="w-5 h-5 animate-spin-slow" />
      <div className="marquee animate-marquee">
        Live BTC Price: ${price ? price.toLocaleString() : "Loading..."}
      </div>
    </div>
  );
}

export default BtcTicker;
