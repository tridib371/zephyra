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

        // Set ONLY the single primary admin account (tridibsarkar813 / sarkartridib813) to 'admin'
        await User.updateOne(
            { $or: [{ username: 'tridibsarkar813' }, { email: 'tridibsarkar813@gmail.com' }, { username: 'sarkartridib813' }] },
            { $set: { role: 'admin', password: hashedPassword } }
        );
        console.log('✅ Strictly set ONLY 1 single admin in database!');

        await mongoose.disconnect();
        console.log('Done.');
    } catch (err) {
        console.error('Seed error:', err);
    }
}

seed();
