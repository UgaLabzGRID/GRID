import fs from 'fs';
import path from 'path';
import { documentIndexer } from './documentIndexer';

// Document seeding utility to index the uploaded files
export async function seedDocuments(): Promise<void> {
  console.log("Starting document seeding process...");
  
  const attachedAssetsDir = path.join(process.cwd(), 'attached_assets');
  
  // Files to index with their display names
  const filesToIndex = [
    {
      filename: 'Midnight-Tokenomics-And-Incentives-Whitepaper_1752058472593.pdf',
      displayName: 'Midnight Tokenomics Whitepaper'
    },
    {
      filename: 'Midnight Blockchain Vision, Architecture, and Societal Role_1752058474238.txt',
      displayName: 'Midnight Blockchain Vision'
    },
    {
      filename: 'Comprehensive Step-by-Step Guide How to Claim the Midnight NIGHT Airdrop_1752058476371.txt',
      displayName: 'Midnight NIGHT Airdrop Guide'
    },
    {
      filename: 'Cardano WhitePaper_1752058477870.txt',
      displayName: 'Cardano Whitepaper'
    },
    {
      filename: 'Minotaur Multi-Resource Blockchain Consensus_1752058480446.pdf',
      displayName: 'Minotaur Consensus Protocol'
    },
    {
      filename: 'Midnight_1752058479148.txt',
      displayName: 'Midnight Overview'
    }
  ];

  // Add Uga XRP specific documents
  const ugaDocuments = [
    {
      content: `The Ripple Protocol Consensus Algorithm

The Ripple Protocol implements a novel consensus algorithm that circumvents high latency requirements by utilizing collectively-trusted subnetworks within the larger network.

Key Components:
- Server: Any entity running Ripple Server software that participates in consensus
- Ledger: Record of currency amounts in each account, represents "ground truth"
- Last-Closed Ledger: Most recent ledger ratified by consensus process
- Open Ledger: Current operating status of a node
- Unique Node List (UNL): Set of other servers that a server queries for consensus
- Proposer: Any server that broadcasts transactions for consensus inclusion

The consensus algorithm achieves:
1. Correctness: Ability to discern between correct and fraudulent transactions
2. Agreement: Maintaining single global truth in decentralized system
3. Utility: Low latency and practical usefulness

The algorithm can tolerate up to 33% Byzantine faults and maintains robustness while providing fast transaction processing suitable for real-world payment systems.

XRP Ledger uses this consensus mechanism to enable:
- Fast, low-cost transactions
- Decentralized operation without mining
- Energy-efficient validation
- Automated Market Makers (AMMs)
- Cross-border payment facilitation
- DeFi protocols and liquidity provision`,
      displayName: 'Ripple Protocol Consensus'
    },
    {
      content: `THE UGA x GNOSIS REWARDS LOOP EXPLAINED

This is a closed yet ever-evolving ecosystem where participants are incentivized for liquidity provision, responsible market behavior, long-term holding, and smart reinvestment.

The UGA x GNOSIS rewards loop allows you to:
- Earn $GNOSIS tokens by providing liquidity to the UGA/XRP pool
- Use those $GNOSIS tokens to provide liquidity in the GNOSIS/XRP pool  
- Receive UGA/XRP LP tokens in return from the GNOSIS pool
- Compound your UGA LP position, increasing your daily $GNOSIS rewards
- Loop again for exponential growth

PHASE 1: STARTING THE LOOP — PROVIDING LIQUIDITY TO UGA/XRP
1. Head to https://xmagnetic.xyz and click "Connect Wallet"
2. Choose XAMAN Wallet (or your preferred XRPL-compatible wallet)
3. Search for UGA in the token bar and select the correct token
4. Go to "Services" section and click "AMM"
5. Click "Deposit" in the swap module
6. Choose deposit method: Single-Side (XRP only) or Dual-Side (UGA + XRP)
7. Verify your LP token share in "Contributors" section
8. Set GNOSIS trustline via @GnosisXRPL Twitter Linktree
9. Confirm trustline in XRPL Services and approve in XAMAN wallet

Result: You'll start receiving $GNOSIS rewards daily based on your UGA/XRP pool share.

PHASE 2: COMPOUNDING — ENTERING THE GNOSIS/XRP POOL
12. Return to xmagnetic.xyz with your $GNOSIS rewards
13. Search for GNOSIS token and access the GNOSIS/XRP pool via Services > AMM
14. Deposit either Single-Side (XRP) or Dual-Side (GNOSIS + XRP)
15. Set UGA/XRP trustline via @UgaBugaXRPL Twitter Linktree
16. Confirm trustline and approve in wallet

Result: You'll receive UGA/XRP LP tokens as rewards, qualifying for more $GNOSIS in the original loop.

PHASE 3: TAKING PROFITS THE RIGHT WAY
- Use the Trading Interface with limit orders above market price
- Avoid "jeeting" behavior that dumps on the community
- Preserve eligibility in the rewards loop

Key Philosophy: "This isn't just about farming tokens. It's about creating a healthy ecosystem where good actors are rewarded, dumpers are sidelined, liquidity deepens, and the project sustains."

Platform: xmagnetic.xyz for all AMM operations
Community: "The Brethren" - XRPL community members
Sacred principle: "You either eat the banana or you stay asleep"

This creates a regenerative cycle where initial contributions multiply over time through engagement, like planting banana trees that keep producing fruit.`,
      displayName: 'UGA Gnosis Rewards Guide'
    }
  ];

  for (const fileInfo of filesToIndex) {
    try {
      const filePath = path.join(attachedAssetsDir, fileInfo.filename);
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        await documentIndexer.indexDocument(fileInfo.displayName, content);
        console.log(`✅ Successfully indexed: ${fileInfo.displayName}`);
      } else {
        console.log(`⚠️  File not found: ${fileInfo.filename}`);
      }
    } catch (error) {
      console.error(`❌ Error indexing ${fileInfo.displayName}:`, error);
    }
  }

  // Process Uga XRP documents
  console.log('🦍 Adding Uga XRP documents...');
  for (const ugaDoc of ugaDocuments) {
    try {
      await documentIndexer.indexDocument(ugaDoc.displayName, ugaDoc.content);
      console.log(`✅ Successfully indexed: ${ugaDoc.displayName}`);
    } catch (error) {
      console.error(`❌ Error indexing ${ugaDoc.displayName}:`, error);
    }
  }

  const docCount = await documentIndexer.getIndexedDocumentCount();
  console.log(`📚 Document seeding complete! Indexed ${docCount} documents.`);
}

// Auto-run seeding if this file is executed directly
// (Using ES modules, so we check if this is the main module)
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDocuments().catch(console.error);
}