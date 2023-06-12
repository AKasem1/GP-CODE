const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChatRoomSchema = mongoose.Schema(
  {
    members: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatRoom", ChatRoomSchema);


