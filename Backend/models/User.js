const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  workEmail: {
    type: String,
    required: [true, 'Work email is required'],
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    // match: [/^\+?[0-9]{10,15}$/, 'Phone number must be a valid international format']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    enum: ['US', 'CANADA', 'INDIA', 'UK', 'AUSTRALIA', 'OTHER']
  },
  visaStatus: {
    type: String,
    required: [true, 'Visa status is required'],
    enum: ['citizen', 'H1B', 'F1', 'other']
  },
  educationDetails: [{
    university: {
      type: String,
      required: [true, 'University is required']
    },
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      enum: ['Bachelors', 'Masters', 'Phd', 'diploma', 'other']
    },
    major: {
      type: String,
      required: [true, 'Major/Specialization is required']
    },
    location: {
      type: String,
      required: [true, 'Location is required']
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    gpa: {
      type: String,
      required: [true, 'GPA is required']
    },
    gpaScale: {
      type: String,
      required: [true, 'GPA scale is required']
    }
  }],
  workExperience: [{
    company: {
      type: String,
      required: [true, 'Company is required']
    },
    title: {
      type: String,
      required: [true, 'Job title is required']
    },
    workStartDate: {
      type: Date,
      required: [true, 'Work start date is required']
    },
    workEndDate: {
      type: Date,
      required: [true, 'Work end date is required']
    },
    workLocation: {
      type: String,
      required: [true, 'Work location is required']
    },
    jobDescription: {
      type: String,
      required: [true, 'Job description is required']
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});


// // Create the User model based on the schema
// const User = mongoose.model('User', userSchema);

// module.exports = User;


// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  console.log("Comparing Passwords")  
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);