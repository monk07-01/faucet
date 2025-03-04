import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";

export default function Faucet() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleClaim = async () => {
    if (!address) {
      setMessage("Please enter a valid address.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 max-w-md text-center shadow-xl bg-white rounded-2xl">
          <CardContent>
            <h2 className="text-2xl font-bold text-purple-700 mb-4">Claim Your Free BFH Tokens</h2>
            <p className="text-gray-600 mb-6">Enter your wallet address to receive testnet tokens.</p>
            <Input 
              className="w-full mb-4 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400" 
              type="text" 
              placeholder="Enter your wallet address" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)}
            />
            <Button 
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-lg transition duration-300"
              onClick={handleClaim}
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin mx-auto" /> : "Claim Tokens"}
            </Button>
            {message && (
              <motion.p 
                className="mt-4 text-sm font-semibold text-purple-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {message}
              </motion.p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
