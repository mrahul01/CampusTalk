const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId : { type : String , required : true,unique : true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String,required: false },
    bio: {type: String, required: false, default: "Hey! Hello There."},
    viewedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],  
    searchHistory: [{ type: String }],
    image: {
        type: String,
        default: "profile.webp"
      },  
    createdAt: { type: Date, default: Date.now },
    isAdmin:{type:Boolean, default:false},
    interest :{type:String,default:"blogs..."},
    year :{type:String,default:"...year"},
    isAllowed :{type:Boolean,default:true}
});

module.exports = mongoose.model("User", UserSchema);