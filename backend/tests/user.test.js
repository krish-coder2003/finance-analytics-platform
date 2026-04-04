const mongoose = require('mongoose');
const User = require('../models/user.model');

describe('User Model Test', () => {
  beforeAll(async () => {
    // In memory or local test db should be connected here, simplified for basic structure
    await mongoose.connect('mongodb://127.0.0.1:27017/financial_db_test');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  it('create & save user successfully', async () => {
    const validUser = new User({
      name: 'Test Testerson',
      email: 'test@testerson.com',
      password: 'password123',
    });
    
    const savedUser = await validUser.save();
    
    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe('Test Testerson');
    expect(savedUser.role).toBe('Viewer'); // Default role
    expect(savedUser.isActive).toBe(true);
  });

  it('should hash password automatically on save', async () => {
    const validUser = new User({
      name: 'Test Hash',
      email: 'hash@test.com',
      password: 'password123',
    });
    const savedUser = await validUser.save();
    expect(savedUser.password).not.toBe('password123'); // Verification of pre hook
  });
});
