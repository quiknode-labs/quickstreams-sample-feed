import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
const BN = require('bn.js');

const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const TRANSFER_SIGNATURE = Web3.utils.sha3('Transfer(address,address,uint256)');

function DashboardTab({ data }) {
  const [usdcMetrics, setUsdcMetrics] = useState({
    averageTransactionsPerBlock: 0,
    totalTransactions: 0,
    uniqueAddresses: new Set(),
    averageTransferAmount: 0,
    highestTransferAmount: 0,
    highestFee: 0
  });

  useEffect(() => {

    let totalTransferAmount = 0;
    let totalTransferCount = 0;
    let highestTransferAmount = 0;
    let highestFee = 0;

    data.forEach(blockDataWrapper => {
      // 'blockDataWrapper.data' is an array containing block information
      blockDataWrapper.data.forEach(blockData => {
        // 'blockData.receipts' is the array of receipts we need to iterate over
        if (!Array.isArray(blockData.receipts)) {
          console.error('Receipts is not an array:', blockData.receipts);
          return; // Skip this iteration
        }

        blockData.receipts.forEach(receipt => {
          // Ensure 'receipt.logs' is an array before iterating
          if (!Array.isArray(receipt.logs)) {
            console.error('Logs is not an array:', receipt.logs);
            return; // Skip this iteration
          }

          receipt.logs.forEach(log => {
            if (log.address.toLowerCase() === USDC_ADDRESS.toLowerCase() && log.topics[0] === TRANSFER_SIGNATURE) {
              const transferValue = new BN(log.data.substring(2), 16).div(new BN(1000000)).toNumber();
              totalTransferAmount += transferValue;
              totalTransferCount++;
              highestTransferAmount = Math.max(highestTransferAmount, transferValue);

              const fee = receipt.gasUsed * receipt.effectiveGasPrice; // Assuming these fields are available
              highestFee = Math.max(highestFee, fee);

              // Add from and to addresses to the unique addresses set
              usdcMetrics.uniqueAddresses.add(log.topics[1]); // 'from' address
              usdcMetrics.uniqueAddresses.add(log.topics[2]); // 'to' address
            }
          });
        });
      });
    });

    const totalBlocks = data.reduce((total, blockDataWrapper) => total + blockDataWrapper.data.length, 0);

    setUsdcMetrics(prevMetrics => ({
      ...prevMetrics,
      totalBlocks,
      totalTransferAmount,
      averageTransactionsPerBlock: totalTransferCount / Math.max(totalBlocks, 1), // Avoid division by zero
      totalTransactions: prevMetrics.totalTransactions + totalTransferCount,
      averageTransferAmount: totalTransferCount > 0 ? totalTransferAmount / totalTransferCount : 0,
      highestTransferAmount: highestTransferAmount, 
      highestFee: highestFee
    }));

  }, [data]);

  const {
    totalBlocks,
    averageTransactionsPerBlock,
    totalTransferAmount,
    totalTransactions,
    uniqueAddresses,
    averageTransferAmount,
    highestTransferAmount,
    highestFee
  } = usdcMetrics;

  return (
    <div className="dashboard-tab">
      <h2 className="text-2xl font-bold mb-4">USDC Metrics</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Blocks</h3>
          <p>{totalBlocks}</p>
        </div>
        <div className="metric-card">
          <h3>Average Transactions/Block</h3>
          <p>{averageTransactionsPerBlock.toFixed(2)}</p>
        </div>
        <div className="metric-card">
          <h3>Total Transactions</h3>
          <p>{totalTransactions}</p>
        </div>
        <div className="metric-card">
          <h3>Unique Wallet Addresses</h3>
          <p>{uniqueAddresses.size}</p>
        </div>
        <div className="metric-card">
          <h3>Total Transfer Amount</h3>
          <p>{totalTransferAmount} USDC</p>
        </div>
        <div className="metric-card">
          <h3>Average Transfer Amount</h3>
          <p>{averageTransferAmount} USDC</p>
        </div>
        <div className="metric-card">
          <h3>Highest Transfer Amount</h3>
          <p>{highestTransferAmount} USDC</p>
        </div>
        <div className="metric-card">
          <h3>Highest Fee Paid</h3>
          <p>{Web3.utils.fromWei(highestFee.toString(), 'ether')} ETH</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardTab;
