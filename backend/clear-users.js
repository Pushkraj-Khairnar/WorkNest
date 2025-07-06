const mongoose = require('mongoose');
require('dotenv').config();

const clearUsers = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database');

    // Clear users
    const User = mongoose.model('User', new mongoose.Schema({}));
    await User.deleteMany({});
    console.log('All users cleared from database');

    // Clear accounts
    const Account = mongoose.model('Account', new mongoose.Schema({}));
    await Account.deleteMany({});
    console.log('All accounts cleared from database');

    // Clear workspaces
    const Workspace = mongoose.model('Workspace', new mongoose.Schema({}));
    await Workspace.deleteMany({});
    console.log('All workspaces cleared from database');

    // Clear members
    const Member = mongoose.model('Member', new mongoose.Schema({}));
    await Member.deleteMany({});
    console.log('All members cleared from database');

    console.log('Database cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

clearUsers(); 