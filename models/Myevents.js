const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const myeventsSchema = new Schema(
  {
    ticketMasterId:String,
    name: String,
    images: { type: String, default: url('') },
    url: String,
    address: String,
    location: {
      longitude: String,
      latitude: String,
    },
    placeName:String,
    idUser: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const Myevents = mongoose.model('Myevents', myeventsSchema);
module.exports = Myevents;
