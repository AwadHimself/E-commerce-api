const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name Is Required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email Is Required"],
      unique: true,
      lowercase: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    phone: String,
    profileImage: String,
    password: {
      type: String,
      required: [true, "Password Is Required"],
      minlength: [6, "Password Is Too Short"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ["user", "manger", "admin"],
      default: "user",
    },
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        alias: String,
        details: String,
        city: String,
        postalCode: String,
        phone: Number,
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

const setImageUrl = (doc) => {
  if (doc.profileImage) {
    const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImage}`;
    doc.profileImage = imageUrl;
  }
};

userSchema.post("init", (doc) => {
  setImageUrl(doc);
});

userSchema.post("save", (doc) => {
  setImageUrl(doc);
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
