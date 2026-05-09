const getApiErrorMessage = (err, defaultMessage) => {
  if (err.response) {
    if (err.response.status === 401) {
      return err.response.data?.message || defaultMessage;
    }
    return err.response.data?.message || defaultMessage;
  }

  if (err.request) {
    return "Cannot reach the server. Please make sure the backend is running and your network is connected.";
  }

  return `${defaultMessage}: ${err.message}`;
};

export default getApiErrorMessage;
