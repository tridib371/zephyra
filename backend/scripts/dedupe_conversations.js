/*
  Migration script: dedupe conversations by canonical threadKey.
  Usage: node scripts/dedupe_conversations.js
  It will:
    - compute threadKey for conversations missing or incorrect
    - find duplicate conversations (same threadKey)
    - move messages from duplicates into the canonical conversation
    - delete duplicate conversation documents
    - update canonical conversation's lastMessage and lastMessageAt
*/

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const MONGO = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/zephyra';

async function run() {
    await mongoose.connect(MONGO);
    console.log('Connected to MongoDB for dedupe migration');

    try {
        const conversations = await Conversation.find({});
        console.log(`Found ${conversations.length} conversations`);

        // normalize threadKeys
        for (const conv of conversations) {
            const ids = (conv.participants || []).map((p) => (p._id ? p._id.toString() : p.toString()));
            if (ids.length < 2) continue;
            ids.sort();
            const key = `${ids[0]}_${ids[1]}`;
            if (conv.threadKey !== key) {
                console.log(`Updating threadKey for conv ${conv._id} -> ${key}`);
                conv.threadKey = key;
                await conv.save();
            }
        }

        // rebuild map
        const grouped = {};
        const all = await Conversation.find({});
        for (const c of all) {
            if (!c.threadKey) continue;
            grouped[c.threadKey] = grouped[c.threadKey] || [];
            grouped[c.threadKey].push(c);
        }

        let totalMerged = 0;
        for (const key of Object.keys(grouped)) {
            const list = grouped[key];
            if (list.length <= 1) continue;

            // choose canonical as the earliest createdAt
            list.sort((a, b) => a.createdAt - b.createdAt);
            const canonical = list[0];
            const duplicates = list.slice(1);

            console.log(`Merging ${duplicates.length} duplicates into canonical ${canonical._id} for key ${key}`);

            for (const dup of duplicates) {
                // move messages
                const res = await Message.updateMany({ conversation: dup._id }, { $set: { conversation: canonical._id } });
                console.log(`  moved ${res.nModified || res.modifiedCount || 0} messages from ${dup._id}`);

                // delete duplicate conversation
                await Conversation.deleteOne({ _id: dup._id });
                totalMerged++;
            }

            // recalc lastMessage for canonical
            const lastMsg = await Message.findOne({ conversation: canonical._id }).sort({ createdAt: -1 }).limit(1);
            if (lastMsg) {
                canonical.lastMessage = lastMsg._id;
                canonical.lastMessageAt = lastMsg.createdAt || lastMsg.updatedAt || new Date();
                await canonical.save();
            }
        }

        console.log(`Dedupe complete. Total conversations removed: ${totalMerged}`);
    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected. Migration finished.');
    }
}

run();
