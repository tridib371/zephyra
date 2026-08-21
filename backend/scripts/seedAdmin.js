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

        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('SarkarTridib813$', salt);

        // First reset ALL users to regular 'user' role
        await User.updateMany({}, { $set: { role: 'user', isBanned: false } });

        // Set ONLY the primary owner account to 'admin' and set fixed password
        await User.updateMany(
            { username: { $in: ['tridibsarkar813', 'tridibsarkar0', 'sarkartridib813'] } },
            { $set: { role: 'admin', password: hashedPassword } }
        );
        console.log('✅ Updated admin password and set ONLY Tridib Sarkar to ADMIN!');

        await mongoose.disconnect();
        console.log('Done.');
    } catch (err) {
        console.error('Seed error:', err);
    }
}

seed();
