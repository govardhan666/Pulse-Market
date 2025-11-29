# 🚀 PulseMarket Deployment Guide

Complete guide for deploying PulseMarket to Somnia testnet and production.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- MetaMask wallet installed
- Somnia testnet STT tokens
- Git installed

## Quick Start (5 Minutes)

```bash
# 1. Clone repository
git clone https://github.com/govardhan666/somnia-mini-hack.git
cd somnia-mini-hack

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Setup environment
cp .env.example .env
# Edit .env with your values

# 4. Compile contracts
npx hardhat compile

# 5. Deploy to Somnia testnet
npx hardhat run scripts/deploy.ts --network somnia

# 6. Update contract address in .env
# Copy deployed address to NEXT_PUBLIC_CONTRACT_ADDRESS

# 7. Run development server
npm run dev

# 8. Open http://localhost:3000
```

## Detailed Deployment Steps

### Step 1: Environment Setup

Create `.env` file:

```env
# Somnia Network Configuration
NEXT_PUBLIC_SOMNIA_CHAIN_ID=50312
NEXT_PUBLIC_SOMNIA_RPC_URL=https://dream-rpc.somnia.network
NEXT_PUBLIC_SOMNIA_EXPLORER_URL=https://shannon-explorer.somnia.network

# Contract Deployment (KEEP SECRET!)
PRIVATE_KEY=your_private_key_here

# WalletConnect (Optional)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Contract Address (Fill after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=
```

#### Getting Your Private Key

**⚠️ SECURITY WARNING**: Never share your private key or commit it to Git!

**Method 1: MetaMask**
1. Open MetaMask
2. Click account menu → Account Details
3. Click "Export Private Key"
4. Enter password
5. Copy private key

**Method 2: Create New Wallet**
```bash
# Use hardhat to generate new wallet
npx hardhat console
# In console:
const wallet = ethers.Wallet.createRandom()
console.log("Address:", wallet.address)
console.log("Private Key:", wallet.privateKey)
```

#### Getting STT Tokens

1. Visit https://testnet.somnia.network/
2. Connect your wallet
3. Click "Get STT Tokens"
4. Confirm transaction
5. Wait for tokens to arrive (usually instant)

### Step 2: Install Dependencies

```bash
# Install all dependencies
npm install --legacy-peer-deps

# If you encounter issues, try:
npm ci --legacy-peer-deps

# Or clear cache first:
npm cache clean --force
npm install --legacy-peer-deps
```

### Step 3: Compile Smart Contracts

```bash
# Compile contracts
npx hardhat compile

# Expected output:
# Compiled 1 Solidity file successfully
```

**Troubleshooting:**
- If compilation fails, check Solidity version in `hardhat.config.ts`
- Ensure you have internet connectivity for downloading compiler
- Try clearing cache: `npx hardhat clean`

### Step 4: Deploy Contracts

```bash
# Deploy to Somnia testnet
npx hardhat run scripts/deploy.ts --network somnia

# Expected output:
# Deploying PulseMarket to Somnia testnet...
# ✅ PulseMarket deployed to: 0xYourContractAddress
# 🔗 View on explorer: https://shannon-explorer.somnia.network/address/0xYourContractAddress
# 📝 Deployment info saved to lib/contract-address.json
```

**Save the contract address!** You'll need it for the next step.

### Step 5: Update Configuration

1. Copy the deployed contract address
2. Open `.env` file
3. Add the address:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddressHere
```
4. Save the file

### Step 6: Run Development Server

```bash
# Start Next.js development server
npm run dev

# Server will start on http://localhost:3000
```

Open your browser and navigate to `http://localhost:3000`

### Step 7: Test the Application

1. **Connect Wallet**
   - Click "Connect Wallet"
   - Select MetaMask
   - Approve connection
   - Ensure you're on Somnia testnet

2. **Create a Test Market**
   - Click "Create Market"
   - Enter question: "Will this demo work perfectly?"
   - Set duration: 7 days
   - Submit transaction
   - Confirm in MetaMask

3. **Place a Trade**
   - Navigate to your created market
   - Select YES or NO
   - Enter shares (e.g., 100)
   - Review cost
   - Click "Buy Shares"
   - Confirm transaction

4. **Verify Real-Time Updates**
   - Open market in two browser windows
   - Place trade in one window
   - Watch price update in other window
   - Check live indicator status

## Production Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

4. **Set Environment Variables**
   - Go to Vercel Dashboard
   - Select your project
   - Navigate to Settings → Environment Variables
   - Add all variables from `.env`

5. **Redeploy**
```bash
vercel --prod
```

### Option 2: Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login**
```bash
netlify login
```

3. **Build**
```bash
npm run build
```

4. **Deploy**
```bash
netlify deploy --prod
```

### Option 3: Docker

1. **Create Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

2. **Build Image**
```bash
docker build -t pulsemarket .
```

3. **Run Container**
```bash
docker run -p 3000:3000 --env-file .env pulsemarket
```

## Post-Deployment Checklist

- [ ] Contract deployed and verified
- [ ] Environment variables configured
- [ ] Frontend accessible via URL
- [ ] Wallet connection works
- [ ] Market creation works
- [ ] Trading works
- [ ] Real-time updates working
- [ ] Portfolio page displays correctly
- [ ] Mobile responsive
- [ ] Analytics configured (optional)

## Verification

### Verify Smart Contract (Optional)

```bash
npx hardhat verify --network somnia YOUR_CONTRACT_ADDRESS
```

### Test All Features

1. **Market Creation**
   - Create market
   - Verify on blockchain
   - Check real-time appearance

2. **Trading**
   - Buy YES shares
   - Buy NO shares
   - Sell shares
   - Verify balance updates

3. **Real-Time Features**
   - Multi-window test
   - Connection indicator
   - Chart updates
   - Portfolio updates

## Troubleshooting

### Issue: Transaction Fails

**Solution:**
- Check you have enough STT tokens
- Verify correct network (Somnia testnet)
- Increase gas limit
- Check contract is deployed correctly

### Issue: Real-Time Updates Not Working

**Solution:**
- Check WebSocket connection
- Verify Somnia RPC URL
- Check browser console for errors
- Ensure SDK initialized correctly

### Issue: Contract Not Found

**Solution:**
- Verify contract address in `.env`
- Check you're on correct network
- Ensure deployment succeeded
- Check explorer for contract

### Issue: Build Fails

**Solution:**
```bash
# Clear cache
rm -rf .next node_modules
npm install --legacy-peer-deps
npm run build
```

## Monitoring

### View Logs

```bash
# Development
npm run dev

# Production (if using PM2)
pm2 logs pulsemarket
```

### Check Contract

Visit Somnia Explorer:
```
https://shannon-explorer.somnia.network/address/YOUR_CONTRACT_ADDRESS
```

### Monitor Real-Time Connections

Check browser console for:
```
✅ Connected to Somnia Data Streams
🔴 Disconnected from Somnia Data Streams
```

## Maintenance

### Update Dependencies

```bash
# Check outdated packages
npm outdated

# Update all dependencies
npm update --legacy-peer-deps

# Update specific package
npm install package-name@latest --legacy-peer-deps
```

### Backup

**Important files to backup:**
- `.env` (store securely, never commit)
- `lib/contract-address.json`
- Deployment scripts
- Contract ABIs

## Security Best Practices

1. **Never commit `.env` file**
2. **Use separate wallets for development and production**
3. **Audit contracts before mainnet deployment**
4. **Use environment-specific keys**
5. **Enable rate limiting on API**
6. **Monitor contract for unusual activity**
7. **Keep dependencies updated**

## Support

If you encounter issues:

1. Check GitHub Issues
2. Read Somnia Documentation
3. Join Somnia Discord
4. Contact hackathon organizers

## Next Steps

After successful deployment:

1. **Create demo markets** for testing
2. **Share with community** on social media
3. **Collect feedback** from early users
4. **Monitor performance** and fix bugs
5. **Plan features** for next iteration

---

## Deployment Checklist Summary

```
☐ Environment variables configured
☐ Dependencies installed
☐ Contracts compiled
☐ Contracts deployed
☐ Contract address updated
☐ Development server running
☐ Wallet connected successfully
☐ Test market created
☐ Test trade executed
☐ Real-time updates verified
☐ Production deployment completed
☐ Domain configured (if applicable)
☐ Analytics setup (optional)
☐ Monitoring enabled
☐ Documentation updated
```

---

**Congratulations! Your PulseMarket instance is now live! 🎉**

For questions or support, check the README or reach out to the development team.
