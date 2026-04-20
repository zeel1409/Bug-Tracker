const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');
const Ticket = require('./models/Ticket');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    console.log('Clearing old data (Users, Projects, Tickets)...');
    await User.deleteMany();
    await Project.deleteMany();
    await Ticket.deleteMany();
    
    console.log('Creating Users...');
    const users = await User.create([
      { name: 'Admin Manager', email: 'admin@bugtracker.com', password: 'password123' },
      { name: 'John Doe', email: 'john@bugtracker.com', password: 'password123' },
      { name: 'Jane Smith', email: 'jane@bugtracker.com', password: 'password123' },
    ]);

    const admin = users[0];
    const dev = users[1];
    const tester = users[2];

    console.log('Creating Project...');
    const project = await Project.create({
      title: 'E-Commerce Platform Redesign',
      description: 'Major overhaul of our main e-commerce application frontend and backend services.',
      key: 'ECOMM',
      owner: admin._id,
      members: [admin._id, dev._id, tester._id]
    });

    console.log('Creating Tickets...');
    const tickets = [
      {
        title: 'Login button is non-responsive on mobile Safari',
        description: 'Users on iOS 15 Safari report that clicking the login button does nothing. Tested on iPhone 12 and confirmed.',
        type: 'bug', priority: 'high', status: 'todo',
        project: project._id, reporter: tester._id, assignee: dev._id, ticketNumber: 1
      },
      {
        title: 'Add dark mode toggle to navigation',
        description: 'Design team provided specs for dark mode. Need a toggle button in the navbar.',
        type: 'feature', priority: 'medium', status: 'todo',
        project: project._id, reporter: admin._id, assignee: null, ticketNumber: 2
      },
      {
        title: 'Optimize product image loading',
        description: 'Images on the homepage take >3s to load over 3G. Implement lazy loading and Next-Gen formats.',
        type: 'improvement', priority: 'medium', status: 'inprogress',
        project: project._id, reporter: dev._id, assignee: dev._id, ticketNumber: 3
      },
      {
        title: 'Payment gateway timeout error',
        description: 'Stripe API times out occasionally during peak hours due to unhandled promise rejections.',
        type: 'bug', priority: 'critical', status: 'inprogress',
        project: project._id, reporter: tester._id, assignee: admin._id, ticketNumber: 4
      },
      {
        title: 'Update privacy policy page content',
        description: 'Legal requested an update to section 3.2 regarding data retention.',
        type: 'task', priority: 'low', status: 'done',
        project: project._id, reporter: admin._id, assignee: tester._id, ticketNumber: 5
      },
      {
        title: 'Fix alignment in footer',
        description: 'The copyright text is not perfectly centered on desktop view.',
        type: 'bug', priority: 'low', status: 'done',
        project: project._id, reporter: tester._id, assignee: dev._id, ticketNumber: 6
      }
    ];

    await Ticket.create(tickets);

    console.log('Database Seeded Successfully!');
    console.log('-------------------------------------------');
    console.log('Login credentials to use:');
    console.log('Email: admin@bugtracker.com | Password: password123');
    console.log('Email: john@bugtracker.com  | Password: password123');
    console.log('-------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Error with data seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
