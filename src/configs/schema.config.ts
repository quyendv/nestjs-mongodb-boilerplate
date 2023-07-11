export const schemaOptions = {
  timestamps: true,
  versionKey: false, // remove key __v: ...
  toJSON: {
    getter: true, // require for using getter
    virtuals: true, // for virtuals key
  },
};
