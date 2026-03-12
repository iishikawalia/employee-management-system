const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Config and Models
dotenv.config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Project = require('./models/Project');
const Attendance = require('./models/Attendance');
const LeaveRequest = require('./models/LeaveRequest');
const CompOff = require('./models/CompOff');
const Timesheet = require('./models/Timesheet');
const Payroll = require('./models/Payroll');

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Project.deleteMany();
    await Attendance.deleteMany();
    await LeaveRequest.deleteMany();
    await CompOff.deleteMany();
    await Timesheet.deleteMany();
    await Payroll.deleteMany();

    // The User schema has a pre-save hook for password hashing,
    // so we can insert unhashed passwords and use .create() or hash them manually for .insertMany()
    // Manual hash for insertMany:
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const employeePassword = await bcrypt.hash('emp123', salt);

    const createdUsers = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@dev.com',
        password: adminPassword,
        role: 'admin',
        department: 'Management',
        position: 'System Administrator',
        baseSalary: 100000,
      },
      {
        name: 'John Doe',
        email: 'john@dev.com',
        password: employeePassword,
        role: 'employee',
        department: 'Engineering',
        position: 'Software Engineer',
        baseSalary: 60000,
      },
      {
        name: 'Jane Smith',
        email: 'jane@dev.com',
        password: employeePassword,
        role: 'employee',
        department: 'Design',
        position: 'UI/UX Designer',
        baseSalary: 55000,
      }
    ]);

    const adminUser = createdUsers[0]._id;
    const emp1 = createdUsers[1]._id;
    const emp2 = createdUsers[2]._id;

    const createdProjects = await Project.insertMany([
      {
        projectName: 'HRMS Portal Phase 2',
        moduleName: 'Leave Management',
        phase: 'Development',
        description: 'Building the leave module',
        assignedEmployees: [emp1, emp2]
      },
      {
        projectName: 'E-commerce App',
        moduleName: 'Cart',
        phase: 'Testing',
        description: 'Testing checkout flow',
        assignedEmployees: [emp1]
      }
    ]);

    const project1 = createdProjects[0]._id;

    await LeaveRequest.insertMany([
      {
        userId: emp1,
        leaveType: 'sick',
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-03-02'),
        reason: 'Fever',
        status: 'approved',
        adminComment: 'Get well soon'
      },
      {
        userId: emp2,
        leaveType: 'casual',
        startDate: new Date('2026-03-15'),
        endDate: new Date('2026-03-16'),
        reason: 'Family function',
        status: 'pending'
      }
    ]);

    await Timesheet.insertMany([
      {
        userId: emp1,
        project: project1,
        module: 'Leave Management',
        phase: 'Dev',
        date: new Date('2026-03-10'),
        hours: 8,
        comment: 'Worked on APIs',
        status: 'approved'
      }
    ]);

    await Payroll.insertMany([
      {
        userId: emp1,
        month: '2026-02',
        baseSalary: 60000,
        deductions: 2000,
        bonuses: 5000,
        netSalary: 63000
      }
    ]);

    console.log('Data Imported successfully');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Project.deleteMany();
    await Attendance.deleteMany();
    await LeaveRequest.deleteMany();
    await CompOff.deleteMany();
    await Timesheet.deleteMany();
    await Payroll.deleteMany();

    console.log('Data Destroyed');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
