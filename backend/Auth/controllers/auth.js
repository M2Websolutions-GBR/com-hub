const asyncHandler = require("@comhub/middleware/async");
const ErrorResponse = require("@comhub/middleware/errorResponse");

const User = require("../models/User");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  let { channelName, email, password } = req.body;

  email = email.toLowerCase();

  const user = await User.create({
    channelName,
    email,
    password,
  });

  if (user) {
    sendTokenResponse(user, 200, res);
  } else {
    const error = new ErrorResponse("Registration failed", 400);
    if (await User.findOne({ channelName })) {
      error.message = "Channel name already exists";
    } else if (await User.findOne({ email })) {
      error.message = "Email already exists";
    }
    return next(error);
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  email = email.toLowerCase();

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Email not found", 404));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Incorrect password", 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, data: {} });
});

// @desc    Get current logged in user
// @route   POST /api/auth/me
// @access  Private
exports.getUser = asyncHandler(async (req, res, next) => {
  const userId = req.user;
  res.status(200).json({ success: true, data: userId });
});

exports.getProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id; // Extract user ID from req.user
  console.log('userId', userId)
  try {
    // Use Mongoose findById method
    const userProfile = await User.findById(userId);

    if (!userProfile) {
      return next(new ErrorResponse('User not found', 404));
    }

    console.log('User Profile:', userProfile);
    res.status(200).json({ success: true, data: userProfile });
  } catch (error) {
    console.error('Error:', error);
    next(new ErrorResponse('Internal Server Error', 500));
  }
});

// @desc    Update user details
// @route   POST /api/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    aboutText: req.body.aboutText,
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
    context: "query",
  });

  res.status(200).json({ success: true, data: user });
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return res.status(400).json({
      success: false,
      error: [
        { field: "currentPassword", message: "Current password is incorrect" },
      ],
    });
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});


// @desc    Update email
// @route   PUT /api/auth/updateemail
// @access  Private
exports.updateEmail = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const newEmail = req.body.newEmail.toLowerCase();
  if (await User.findOne({ email: newEmail })) {
    return next(new ErrorResponse("Email already exists", 400));
  }

  user.email = newEmail;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Update channel name
// @route   PUT /api/auth/updatechannelname
// @access  Private
exports.updateChannelName = asyncHandler(async (req, res, next) => {
  const { newChannelName } = req.body;
  const userId = req.user.id;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    // Update the channel name
    user.channelName = newChannelName;
    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error updating channel name:", error);
    next(new ErrorResponse("Server error", 500));
  }
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({ success: true, token });
};
