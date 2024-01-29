import React, { useState } from 'react';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';

import Web3 from 'web3';

function LogsTab({ data }) {
  const [expandedRow, setExpandedRow] = useState(null);

  // Helper function to convert hex timestamp to a human-readable format
  const hexToReadableDate = (hexTimestamp) => {
    const timestamp = parseInt(hexTimestamp, 16);
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const ERC20_TRANSFER_EVENT_SIGNATURE = Web3.utils.sha3('Transfer(address,address,uint256)');

    // Function to count ERC20 Transfer events in receipts
  const countERC20Transfers = (receipts) => {
    let transferCount = 0;
    receipts.forEach(receipt => {
      receipt.logs.forEach(log => {
        if (log.topics[0] === ERC20_TRANSFER_EVENT_SIGNATURE) {
          transferCount++;
        }
      });
    });
    return transferCount;
  };


  return (
    <div>
      {data.map((item, index) => {
        const block = item.data[0].block;
        const erc20TransferCount = countERC20Transfers(item.data[0].receipts);

        return (
          <div key={index} className="mb-4">
            <div 
              className="p-2 bg-gray-100 cursor-pointer" 
              onClick={() => setExpandedRow(expandedRow === index ? null : index)}
            >
              <div>{item.metadata.dataset} | {item.metadata.network} </div>
              <div>Block Number: {item.metadata.batch_end_range} | Timestamp: {hexToReadableDate(block.timestamp)}</div>
              <div>Transaction Count: {block.transactions.length} | ERC20 Transfer Events: {erc20TransferCount}</div>
            </div>
            {expandedRow === index && (
              <div className="p-2">
                <JsonView src={item} collapsed={false} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default LogsTab;
