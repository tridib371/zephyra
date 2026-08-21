const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const User = require('../models/User');
        const users = await User.find().select('name username email role isBanned');
        console.log('Current users count:', users.length);
        console.log(users);

        // Ensure all users have default role and isBanned if missing
        await User.updateMany({ role: { $exists: false } }, { $set: { role: 'user', isBanned: false } });

        // Promote tridib and test accounts to admin
        await User.updateMany(
            { username: { $in: ['tridibsarkar0', 'tridibsarkar813', 'testuser'] } },
            { $set: { role: 'admin' } }
        );
        console.log('✅ Promoted tridibsarkar0, tridibsarkar813, and testuser to ADMIN role!');

        await mongoose.disconnect();
        console.log('Done.');
    } catch (err) {
        console.error('Seed error:', err);
    }
}

seed();
