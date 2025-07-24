import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
      required: true,
    },
  },
  {
    timestamps: true,
  },
  {
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

contactsSchema.methods.toJSON = function () {
  const contact = this;
  const contactObject = contact.toObject();
  delete contactObject.password;
  return contactObject;
};
const Contact = mongoose.model('Contact', contactsSchema);

export default Contact;
