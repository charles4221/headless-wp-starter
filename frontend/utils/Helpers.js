const axios = require('axios');

/**
 * Method for getting data from the passed endpoint URL.
 *
 * @param   {String} endpoint The endpoint URL string to call.
 * @returns {Promise} A Promise resolution or rejection.
 */
const api = (endpoint) => new Promise((resolve, reject) => {
	axios.get(endpoint)
		.then((response) => resolve(response.data))
		.catch((error) => reject(error));
});

module.exports = {
	api
}
