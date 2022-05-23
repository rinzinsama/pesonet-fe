let response = {};

const serialize = (res) => {
  response = res?.data || {};
  response.status = res?.status || 500;

  return response;
};

module.exports = {
  serialize,
};
