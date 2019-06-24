module.exports = {
  save: (model) => {
    return new Promise((resolve, reject) => {
      model.save((err, data) => {
        if (err) {
          reject(err);
        } else if (data) {
          resolve(data);
        }
      });
    });
  },

  promise: (query) => {
    return new Promise((resolve, reject) => {
      query.lean().exec((err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
};
