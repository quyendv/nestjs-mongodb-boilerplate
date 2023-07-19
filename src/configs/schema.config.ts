export const schemaOptions = {
  timestamps: true,
  versionKey: false, // remove key __v: ...
  toJSON: {
    getters: true, // require for using getter
    virtuals: true, // for virtuals key
  },
};
