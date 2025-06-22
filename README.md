# 🌟 Starly – Stellar Reward & Staking Platform
CANVA LINK : [ https://www.canva.com/design/DAGq_RBWKMY/O3G2rrLQQaGS1F6gEh9uMQ/edit?utm_content=DAGq_RBWKMY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton ] 

![231c6ea689a2e4e5d9af161aab40a3a2](https://github.com/user-attachments/assets/738df759-143d-43e4-bedb-56c4d0ab824f)



**Starly** is a decentralized reward platform built on the **Stellar Blockchain**, powered by **Soroban smart contracts**. Users earn XLM tokens by completing off-chain tasks created by project owners. Users who **stake XLM tokens** gain access to **exclusive reward tasks**. All staked tokens are securely held in the contract, and task validation is handled manually by project admins.

---
## 🚩 About our team

- Berk Çiçek
- Talha Aydın
- Ömer Faruk Yıldız

---

## 📌 Project Description

Starly is a Web3 reward app where users earn **XLM** tokens by completing tasks. Projects create tasks and users manually complete them off-chain. Tasks are rewarded once approved. Users who stake their tokens directly inside the smart contract gain access to higher-value or exclusive missions. With fast, low-fee Stellar transactions and Soroban's smart contract power, Starly brings engagement and real utility to blockchain communities.

---

## 🌍 Vision Statement

Starly’s goal is to make Web3 user engagement real, simple, and scalable. By combining token staking with a task-based reward system, it helps communities grow while rewarding true contributors. Powered by Stellar’s speed and Soroban’s programmability, it provides a low-cost, secure, and transparent way to engage users. Starly opens the door for any project to attract real participation, not just clicks — helping create a more sustainable and inclusive blockchain world.

---

## 🌟 Key Features

## 🧠 Key Features

### ✅ Task & Reward System
- Manual task verification (off-chain)
- Staked users access exclusive tasks
- Rewards distributed via Soroban smart contract

### 🏠 RWA Tokenization (Optional Feature)
- Custom metadata for each asset: `name`, `type`, `legal_doc_hash`, `valuation`
- Compliance system (KYC, accreditation, jurisdiction)
- Whitelist system for transfers
- Controlled minting, burning, pausing
- On-chain valuation updates

### 🔐 Compliance & Security
- Admin-only minting/burning
- Compliance verification before transfers
- Optional time-limited compliance expiration
- Address whitelist enforcement

---

## 💾 Contract State Structure

- `ADMIN`: Owner address
- `METADATA`: Asset info (`name`, `symbol`, `valuation`, etc.)
- `COMPLIANCE`: Map of KYC-compliant addresses
- `WHITELIST`: Vec of approved addresses
- `BALANCES`: Map of user token holdings
- `PAUSED`: Contract pause status
- `SUPPLY`: Total token supply

---

## 🧠 Software Development Plan

### Frontend (React + Freighter Wallet Integration)
- Connect wallet, view tasks, stake tokens, and claim rewards.
- Project panel for task creation and completion approvals.

### Backend
- Stores user/task data.
- Verifies task completions.
- Grants access to exclusive tasks if staked.

### Testing & Auditing
- Unit tests for contract logic.
- Full user flow integration tests.

### Deployment
- Contract on Stellar **Testnet**.
- ***Smart Contract Link***

---

## Project Demo Video
***VIDEO LINK***

---

## 📦 Installation Guide
>git clone https://github.com/berkcicekk/starly/tree/main

>cd rwa-frontend

>npm install

>npm run dev

