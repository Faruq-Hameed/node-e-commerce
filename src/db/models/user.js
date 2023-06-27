const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
{
	userName: {
		type: String,
		required: true,
		trim: true,
	},
    firstName:{
		type: String,
		required: true,
		trim: true,
	},
    lastName:{
		type: String,
		required: true,
		trim: true,
	},

	email: {
		type: String,
		required: true,
		trim: true,
	},
	mobileNumber: {
		type: String,
		maxlength: 11,
		required: true,
	},
	birthYear: {
		type: Number,
		max: 2000,
		min: 1900,
	},
	password :{
		type: String,
		min: 6,
		required: true,
	},
	is_active: {
		type: Boolean,
		default: true,
	},
},
{ timestamps: true }
);

// Hash the password before saving
UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
	  next();
	}
  
	try {
	  const salt = await bcrypt.genSalt(10);
	  const hashedPassword = await bcrypt.hash(this.password, salt);
	  this.password = hashedPassword;
	  next();
	} catch (error) {
	  next(error);
	}
  });
  
  UserSchema.methods.comparePassword = async function (candidatePassword) {
	const isMatch = await bcrypt.compare(candidatePassword, this.password);
	return isMatch;
  };
  

const User = mongoose.model("user", UserSchema);

module.exports = User;