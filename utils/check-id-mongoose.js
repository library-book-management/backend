const checkIdMongo = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

module.exports = checkIdMongo;
