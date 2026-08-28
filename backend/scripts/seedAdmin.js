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

        const adminPassword = process.env.ADMIN_PASSWORD || 'SarkarTridib813$';
        const adminEmail = process.env.ADMIN_EMAIL || 'sarkartridib813@gmail.com';
        const adminUsername = process.env.ADMIN_USERNAME || 'sarkartridib813';

        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // 1. Reset ALL existing users to regular 'user' role
        await User.updateMany({}, { $set: { role: 'user', isBanned: false } });

        // 2. Find or create the admin user
        let adminDoc = await User.findOne({
            $or: [{ username: adminUsername }, { email: adminEmail }],
        });

        if (adminDoc) {
            adminDoc.name = 'Administrator';
            adminDoc.username = adminUsername;
            adminDoc.email = adminEmail;
            adminDoc.role = 'admin';
            adminDoc.password = hashedPassword;
            await adminDoc.save();
        } else {
            adminDoc = await User.create({
                name: 'Administrator',
                username: adminUsername,
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                profilePicture: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            });
        }

        console.log(`✅ EXACT Admin set: ${adminDoc.name} (@${adminDoc.username} • ${adminDoc.email})`);

        await mongoose.disconnect();
        console.log('Done.');
    } catch (err) {
        console.error('Seed error:', err);
    }
}

seed();
