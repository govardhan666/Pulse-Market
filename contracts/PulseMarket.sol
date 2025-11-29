// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title PulseMarket
 * @dev Real-time prediction market platform powered by Somnia Data Streams
 * @notice This contract manages market creation, trading, and settlement
 */
contract PulseMarket {
    struct Market {
        uint256 id;
        string question;
        string description;
        address creator;
        uint256 endTime;
        uint256 resolutionTime;
        uint256 totalYesShares;
        uint256 totalNoShares;
        uint256 totalVolume;
        bool resolved;
        bool outcome; // true = YES, false = NO
        uint256 createdAt;
        MarketStatus status;
    }

    struct Position {
        uint256 yesShares;
        uint256 noShares;
        uint256 invested;
    }

    struct Order {
        uint256 id;
        uint256 marketId;
        address trader;
        bool isYes;
        uint256 shares;
        uint256 price;
        uint256 timestamp;
        OrderStatus status;
    }

    enum MarketStatus {
        Active,
        Closed,
        Resolved,
        Cancelled
    }

    enum OrderStatus {
        Open,
        Filled,
        Cancelled
    }

    // State variables
    uint256 public marketCounter;
    uint256 public orderCounter;
    uint256 public constant PLATFORM_FEE = 20; // 2% = 20/1000
    uint256 public constant FEE_DENOMINATOR = 1000;

    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => Position)) public positions;
    mapping(uint256 => Order) public orders;
    mapping(uint256 => uint256[]) public marketOrders;
    mapping(address => uint256[]) public userMarkets;
    mapping(address => uint256) public userBalances;

    // Events
    event MarketCreated(
        uint256 indexed marketId,
        address indexed creator,
        string question,
        uint256 endTime
    );

    event OrderPlaced(
        uint256 indexed orderId,
        uint256 indexed marketId,
        address indexed trader,
        bool isYes,
        uint256 shares,
        uint256 price
    );

    event OrderFilled(
        uint256 indexed orderId,
        address indexed buyer,
        address indexed seller,
        uint256 shares,
        uint256 price
    );

    event MarketResolved(
        uint256 indexed marketId,
        bool outcome,
        uint256 timestamp
    );

    event PositionUpdated(
        uint256 indexed marketId,
        address indexed user,
        uint256 yesShares,
        uint256 noShares
    );

    event Withdrawal(address indexed user, uint256 amount);

    // Modifiers
    modifier marketExists(uint256 marketId) {
        require(marketId < marketCounter, "Market does not exist");
        _;
    }

    modifier marketActive(uint256 marketId) {
        require(markets[marketId].status == MarketStatus.Active, "Market not active");
        require(block.timestamp < markets[marketId].endTime, "Market ended");
        _;
    }

    modifier onlyMarketCreator(uint256 marketId) {
        require(markets[marketId].creator == msg.sender, "Not market creator");
        _;
    }

    /**
     * @dev Create a new prediction market
     * @param question The market question
     * @param description Detailed description
     * @param duration Market duration in seconds
     */
    function createMarket(
        string calldata question,
        string calldata description,
        uint256 duration
    ) external returns (uint256) {
        require(duration > 0 && duration <= 365 days, "Invalid duration");
        require(bytes(question).length > 0, "Question required");

        uint256 marketId = marketCounter++;
        uint256 endTime = block.timestamp + duration;

        markets[marketId] = Market({
            id: marketId,
            question: question,
            description: description,
            creator: msg.sender,
            endTime: endTime,
            resolutionTime: 0,
            totalYesShares: 0,
            totalNoShares: 0,
            totalVolume: 0,
            resolved: false,
            outcome: false,
            createdAt: block.timestamp,
            status: MarketStatus.Active
        });

        userMarkets[msg.sender].push(marketId);

        emit MarketCreated(marketId, msg.sender, question, endTime);

        return marketId;
    }

    /**
     * @dev Place a buy order for shares
     * @param marketId Market ID
     * @param isYes true for YES shares, false for NO shares
     * @param shares Number of shares to buy
     */
    function buyShares(
        uint256 marketId,
        bool isYes,
        uint256 shares
    ) external payable marketExists(marketId) marketActive(marketId) {
        require(shares > 0, "Shares must be > 0");
        require(msg.value > 0, "Payment required");

        Market storage market = markets[marketId];
        Position storage position = positions[marketId][msg.sender];

        uint256 cost = calculateCost(marketId, isYes, shares);
        require(msg.value >= cost, "Insufficient payment");

        // Update shares
        if (isYes) {
            position.yesShares += shares;
            market.totalYesShares += shares;
        } else {
            position.noShares += shares;
            market.totalNoShares += shares;
        }

        position.invested += cost;
        market.totalVolume += cost;

        // Create order record
        uint256 orderId = orderCounter++;
        orders[orderId] = Order({
            id: orderId,
            marketId: marketId,
            trader: msg.sender,
            isYes: isYes,
            shares: shares,
            price: cost,
            timestamp: block.timestamp,
            status: OrderStatus.Filled
        });

        marketOrders[marketId].push(orderId);

        // Refund excess payment
        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }

        emit OrderPlaced(orderId, marketId, msg.sender, isYes, shares, cost);
        emit PositionUpdated(marketId, msg.sender, position.yesShares, position.noShares);
    }

    /**
     * @dev Sell shares back to the market
     * @param marketId Market ID
     * @param isYes true for YES shares, false for NO shares
     * @param shares Number of shares to sell
     */
    function sellShares(
        uint256 marketId,
        bool isYes,
        uint256 shares
    ) external marketExists(marketId) marketActive(marketId) {
        require(shares > 0, "Shares must be > 0");

        Position storage position = positions[marketId][msg.sender];
        Market storage market = markets[marketId];

        if (isYes) {
            require(position.yesShares >= shares, "Insufficient YES shares");
            position.yesShares -= shares;
            market.totalYesShares -= shares;
        } else {
            require(position.noShares >= shares, "Insufficient NO shares");
            position.noShares -= shares;
            market.totalNoShares -= shares;
        }

        uint256 payout = calculatePayout(marketId, isYes, shares);
        uint256 fee = (payout * PLATFORM_FEE) / FEE_DENOMINATOR;
        uint256 netPayout = payout - fee;

        userBalances[msg.sender] += netPayout;

        emit PositionUpdated(marketId, msg.sender, position.yesShares, position.noShares);
    }

    /**
     * @dev Resolve a market with an outcome
     * @param marketId Market ID
     * @param outcome true for YES, false for NO
     */
    function resolveMarket(
        uint256 marketId,
        bool outcome
    ) external marketExists(marketId) onlyMarketCreator(marketId) {
        Market storage market = markets[marketId];
        require(block.timestamp >= market.endTime, "Market not ended");
        require(!market.resolved, "Already resolved");

        market.resolved = true;
        market.outcome = outcome;
        market.resolutionTime = block.timestamp;
        market.status = MarketStatus.Resolved;

        emit MarketResolved(marketId, outcome, block.timestamp);
    }

    /**
     * @dev Claim winnings from a resolved market
     * @param marketId Market ID
     */
    function claimWinnings(uint256 marketId) external marketExists(marketId) {
        Market storage market = markets[marketId];
        require(market.resolved, "Market not resolved");

        Position storage position = positions[marketId][msg.sender];
        uint256 winningShares = market.outcome ? position.yesShares : position.noShares;

        require(winningShares > 0, "No winning shares");

        uint256 totalWinningShares = market.outcome ? market.totalYesShares : market.totalNoShares;
        uint256 payout = (market.totalVolume * winningShares) / totalWinningShares;

        // Clear position
        position.yesShares = 0;
        position.noShares = 0;

        userBalances[msg.sender] += payout;

        emit PositionUpdated(marketId, msg.sender, 0, 0);
    }

    /**
     * @dev Withdraw user balance
     */
    function withdraw() external {
        uint256 balance = userBalances[msg.sender];
        require(balance > 0, "No balance to withdraw");

        userBalances[msg.sender] = 0;
        payable(msg.sender).transfer(balance);

        emit Withdrawal(msg.sender, balance);
    }

    /**
     * @dev Calculate cost to buy shares using constant product formula
     */
    function calculateCost(
        uint256 marketId,
        bool isYes,
        uint256 shares
    ) public view returns (uint256) {
        Market storage market = markets[marketId];

        uint256 currentYes = market.totalYesShares + 1000; // Add liquidity base
        uint256 currentNo = market.totalNoShares + 1000;

        uint256 k = currentYes * currentNo;

        if (isYes) {
            uint256 newYes = currentYes + shares;
            uint256 newNo = k / newYes;
            return ((currentNo - newNo) * 1 ether) / 1000;
        } else {
            uint256 newNo = currentNo + shares;
            uint256 newYes = k / newNo;
            return ((currentYes - newYes) * 1 ether) / 1000;
        }
    }

    /**
     * @dev Calculate payout for selling shares
     */
    function calculatePayout(
        uint256 marketId,
        bool isYes,
        uint256 shares
    ) public view returns (uint256) {
        return (calculateCost(marketId, isYes, shares) * 98) / 100; // 2% slippage
    }

    /**
     * @dev Get current market price for YES shares (0-100)
     */
    function getMarketPrice(uint256 marketId) public view returns (uint256) {
        Market storage market = markets[marketId];
        uint256 totalShares = market.totalYesShares + market.totalNoShares;

        if (totalShares == 0) return 50; // 50% initial price

        return (market.totalYesShares * 100) / totalShares;
    }

    /**
     * @dev Get user position in a market
     */
    function getUserPosition(
        uint256 marketId,
        address user
    ) external view returns (uint256 yesShares, uint256 noShares, uint256 invested) {
        Position storage position = positions[marketId][user];
        return (position.yesShares, position.noShares, position.invested);
    }

    /**
     * @dev Get all orders for a market
     */
    function getMarketOrders(uint256 marketId) external view returns (uint256[] memory) {
        return marketOrders[marketId];
    }

    /**
     * @dev Get markets created by a user
     */
    function getUserMarkets(address user) external view returns (uint256[] memory) {
        return userMarkets[user];
    }

    /**
     * @dev Get market details
     */
    function getMarket(uint256 marketId) external view returns (Market memory) {
        return markets[marketId];
    }

    // Receive function to accept ETH
    receive() external payable {}
}
