import express from 'express';
import Auction from '../models/Auction.js';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js'; // Authentication middleware is used

const router = express.Router();

//Place a Bid on an Auction (Authenticated Users Only)
router.post('/auctions/:id/bid', authMiddleware, async (req, res) => {
  try {

    const { bidAmount } = req.body;
    const userId = req.user.id;
    const auctionId = req.params.id.trim();

    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    //Check if auction is closed
    if (auction.isClosed || new Date() >= new Date(auction.closingTime)) {
      return res.status(400).json({ message: 'Auction is closed. No more bids allowed.' });
    }

    //Ensure the bid is higher than the current highest bid
    if (bidAmount <= auction.highestBid) {
      return res.status(400).json({ message: 'Your bid must be higher than the current highest bid.' });
    }

    //Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //Update auction with new highest bid & bidder
    auction.highestBid = bidAmount;
    auction.highestBidder = userId;
    auction.bids.push({ user: userId, amount: bidAmount });

    await auction.save();

    res.json({
      message: 'Bid placed successfully!',
      auction: {
        itemName: auction.itemName,
        highestBid: auction.highestBid,
        highestBidder: user.username,
        closingTime: auction.closingTime,
      }
    });
  } catch (error) {
    console.error('Error placing bid:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

//Create an Auction (Authenticated Users Only)
router.post('/auctions', authMiddleware, async (req, res) => {
  try {
    const { itemName, description, startingBid, closingTime } = req.body;

    if (!itemName || !description || !startingBid || !closingTime) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newAuction = new Auction({
      itemName,
      description,
      startingBid,
      closingTime,
      createdBy: req.user.id
    });

    await newAuction.save();
    res.status(201).json({ message: 'Auction created successfully!', auction: newAuction });
  } catch (error) {
    console.error('Error posting auction:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

//Get All Auctions
router.get('/auctions', async (req, res) => {
  try {
    const auctions = await Auction.find()
      .populate('highestBidder', 'username')
      .populate('bids.user', 'username')
      .select('itemName highestBid highestBidder closingTime isClosed bids');

    res.json(auctions);
  } catch (error) {
    console.error('Error fetching auctions:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

//Get a Single Auction by ID
router.get('/auctions/:id', async (req, res) => {
  try {
    const auctionId = req.params.id.trim();
    const auction = await Auction.findById(auctionId)
      .populate('highestBidder', 'username')
      .populate('bids.user', 'username');

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    //Mark auction as closed if expired
    if (new Date() >= new Date(auction.closingTime) && !auction.isClosed) {
      auction.isClosed = true;
      await auction.save();
    }

    res.json(auction);
  } catch (error) {
    console.error('Error fetching auction:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

//Update an Auction (Authenticated Users Only)
router.put('/auctions/:id', authMiddleware, async (req, res) => {
  try {
    const { itemName, description, startingBid, closingTime } = req.body;
    const auctionId = req.params.id.trim();
    const auction = await Auction.findById(auctionId);

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    //Ensure only the creator can update
    if (auction.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to update this auction' });
    }

    //Update fields if provided
    if (itemName) auction.itemName = itemName;
    if (description) auction.description = description;
    if (startingBid) auction.startingBid = startingBid;
    if (closingTime) auction.closingTime = closingTime;

    await auction.save();

    res.json({ message: 'Auction updated successfully!', auction });
  } catch (error) {
    console.error('Error updating auction:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

//Delete an Auction (Authenticated Users Only)
router.delete('/auctions/:id', authMiddleware, async (req, res) => {
  try {
    const auctionId = req.params.id.trim(); // Get auction ID from params
    const userId = req.user.id; // Extract user ID from token

    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Ensure only the auction creator can delete it
    if (auction.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized! You can only delete your own auctions.' });
    }

    await Auction.findByIdAndDelete(auctionId);
    res.json({ message: 'Auction deleted successfully!' });
  } catch (error) {
    console.error('Error deleting auction:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

export default router;
