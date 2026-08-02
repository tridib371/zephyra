/*
  Delete E2E users and related data.
  Usage: node backend/scripts/delete_e2e_users.js
*/

const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const User = require('../models/User');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

const MONGO = process.env.MONGO_URI;
if (!MONGO) {
    console.error('No MONGO_URI found in .env');
    process.exit(1);
}

async function run() {
    await mongoose.connect(MONGO);
    console.log('Connected to MongoDB');

    try {
        const regex = /^e2e_user_/i;
        const e2eUsers = await User.find({ username: { $regex: regex } });
        if (!e2eUsers.length) {
            console.log('No e2e users found. Nothing to do.');
            return;
        }

        const ids = e2eUsers.map(u => u._id);
        console.log(`Found ${e2eUsers.length} e2e users. IDs:`, ids.map(i => i.toString()));

        // Delete Posts authored by these users
        const postsRes = await Post.deleteMany({ author: { $in: ids } });
        console.log('Deleted posts count:', postsRes.deletedCount || postsRes.n || 0);

        // Delete messages where sender or recipient is in ids
        const messagesRes = await Message.deleteMany({ $or: [{ sender: { $in: ids } }, { recipient: { $in: ids } }] });
        console.log('Deleted messages count:', messagesRes.deletedCount || messagesRes.n || 0);

        // Find conversations involving these users
        const convs = await Conversation.find({ participants: { $in: ids } });
        const convIds = convs.map(c => c._id);
        if (convIds.length) {
            // delete messages in these conversations (if any remain)
            const msgInConv = await Message.deleteMany({ conversation: { $in: convIds } });
            console.log('Deleted messages in conversations:', msgInConv.deletedCount || msgInConv.n || 0);

            const convRes = await Conversation.deleteMany({ _id: { $in: convIds } });
            console.log('Deleted conversations count:', convRes.deletedCount || convRes.n || 0);
        } else {
            console.log('No conversations found for e2e users');
        }

        // Delete notifications where sender or recipient is in ids
        const notifRes = await Notification.deleteMany({ $or: [{ sender: { $in: ids } }, { recipient: { $in: ids } }] });
        console.log('Deleted notifications count:', notifRes.deletedCount || notifRes.n || 0);

        // Remove from other users' followers/following
        const updateFollowers = await User.updateMany(
            { followers: { $in: ids } },
            { $pull: { followers: { $in: ids } } }
        );
        const updateFollowing = await User.updateMany(
            { following: { $in: ids } },
            { $pull: { following: { $in: ids } } }
        );
        console.log('Updated followers/following on other users');

        // Finally delete the user documents
        const usersDel = await User.deleteMany({ _id: { $in: ids } });
        console.log('Deleted users count:', usersDel.deletedCount || usersDel.n || 0);

        console.log('E2E user deletion complete');
    } catch (err) {
        console.error('Error during deletion:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

run();
