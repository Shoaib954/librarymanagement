const Member = require('../models/Member');
const Faculty = require('../models/Faculty');
const Admin = require('../models/Admin');

exports.loginPage = (req, res) => {
  res.render('auth/login', { title: 'Login - Library Management' });
};

exports.registerPage = (req, res) => {
  res.render('auth/register', { title: 'Register - Library Management' });
};

exports.login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    let user;
    
    if (userType === 'admin') {
      user = await Admin.findOne({ email });
    } else if (userType === 'faculty') {
      user = await Faculty.findOne({ email });
    } else {
      user = await Member.findOne({ email });
    }
    
    if (!user || !await user.comparePassword(password)) {
      return res.render('auth/login', { 
        error: 'Invalid credentials',
        title: 'Login - Library Management'
      });
    }
    
    if (!user.isActive) {
      return res.render('auth/login', { 
        error: 'Account is inactive',
        title: 'Login - Library Management'
      });
    }
    
    req.session.user = {
      id: user._id,
      name: user.name || user.username,
      email: user.email,
      role: userType,
      membershipId: user.membershipId,
      facultyId: user.facultyId,
      maxBooks: user.maxBooks || 3
    };
    
    res.redirect('/dashboard');
  } catch (error) {
    res.render('auth/login', { 
      error: error.message,
      title: 'Login - Library Management'
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { role, ...userData } = req.body;
    
    if (role === 'faculty') {
      const faculty = new Faculty(userData);
      faculty.facultyId = 'FAC' + Date.now();
      await faculty.save();
    } else {
      const member = new Member(userData);
      member.membershipId = 'MEM' + Date.now();
      await member.save();
    }
    
    res.render('auth/login', { 
      success: 'Registration successful! Please login.',
      title: 'Login - Library Management'
    });
  } catch (error) {
    res.render('auth/register', { 
      error: error.message,
      title: 'Register - Library Management'
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

exports.adminRegisterPage = (req, res) => {
  res.render('auth/admin-register', { title: 'Admin Registration - Library Management' });
};

exports.adminRegister = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    
    if (password !== confirmPassword) {
      return res.render('auth/admin-register', { 
        error: 'Passwords do not match',
        title: 'Admin Registration - Library Management'
      });
    }
    
    const admin = new Admin({ username, email, password });
    await admin.save();
    
    res.render('auth/login', { 
      success: 'Admin account created successfully! Please login.',
      title: 'Login - Library Management'
    });
  } catch (error) {
    res.render('auth/admin-register', { 
      error: error.message,
      title: 'Admin Registration - Library Management'
    });
  }
};



exports.requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  next();
};

exports.requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.render('error', { error: 'Admin access required' });
  }
  next();
};