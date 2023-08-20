import axios from "axios";
import CryptoJS from "crypto-js";

/**
 * RapydClient class represents a client to interact with Rapyd APIs.
 */
class RapydClient {
  /**
   * @constructor
   * @param {string} SECRET_KEY - Your Rapyd Secret Key.
   * @param {string} ACCESS_KEY - Your Rapyd Access Key.
   */
  constructor(SECRET_KEY, ACCESS_KEY) {
    this.SECRET_KEY = SECRET_KEY;
    this.ACCESS_KEY = ACCESS_KEY;
    this.BASE_URL = "https://sandboxapi.rapyd.net";
  }

  /**
   * Make an API request.
   * @private
   * @param {string} method - HTTP method ("get" or "post").
   * @param {string} urlPath - Endpoint path.
   * @param {Object} [data] - Data for POST request.
   * @returns {Object} API response data.
   */
  async _makeRequest(method, urlPath, data = null) {
    const { rapydRequestTimestamp, rapydSignatureSalt, rapydSignature } = sign(method, this.SECRET_KEY, this.ACCESS_KEY, urlPath, data);

    try {
      const config = {
        headers: {
          access_key: this.ACCESS_KEY,
          salt: rapydSignatureSalt,
          timestamp: rapydRequestTimestamp,
          signature: rapydSignature,
        },
      };

      const response =
        method === "get" ? await axios.get(`${this.BASE_URL}${urlPath}`, config) : await axios.post(`${this.BASE_URL}${urlPath}`, data, config);

      return response.data;
    } catch (error) {
      const { status } = error.response;
      const message = error.response.data.status.message;
      throw { status, message };
    }
  }

  /**
   * Get a list of supported countries.
   * @param {string} urlPath - Endpoint path.
   * @returns {Object} Countries data.
   */
  getCountries(urlPath) {
    return this._makeRequest("get", urlPath);
  }

  /**
   * Get payment methods available for a specific country.
   * @param {string} urlPath - Endpoint path.
   * @returns {Object} Payment methods data.
   */
  getPaymentMethodsByCountry(urlPath) {
    return this._makeRequest("get", urlPath);
  }

  /**
   * Get required fields for a specific payment method.
   * @param {string} urlPath - Endpoint path.
   * @returns {Object} Required fields data.
   */
  getRequiredFieldsByPaymentMethod(urlPath) {
    return this._makeRequest("get", urlPath);
  }

  /**
   * Create a payment.
   * @param {string} urlPath - Endpoint path.
   * @param {Object} data - Payment data.
   * @returns {Object} Payment creation response data.
   */
  createPayment(urlPath, data) {
    return this._makeRequest("post", urlPath, data);
  }
}

/**
 * Sign an API request for authentication.
 * @private
 * @param {string} requestMethod - HTTP method.
 * @param {string} secretKey - Rapyd Secret Key.
 * @param {string} accessKey - Rapyd Access Key.
 * @param {string} urlPath - Endpoint path.
 * @param {Object} [data={}] - Request data for POST requests.
 * @returns {Object} Signature data.
 */
const sign = (requestMethod, secretKey, accessKey, urlPath, data = {}) => {
  const rapydRequestTimestamp = (Math.floor(Date.now() / 1000) - 10).toString();
  const rapydSignatureSalt = CryptoJS.lib.WordArray.random(12);

  const body = data && Object.keys(data).length ? JSON.stringify(data) : "";

  const toSign = requestMethod + urlPath + rapydSignatureSalt + rapydRequestTimestamp + accessKey + secretKey + body;

  let rapydSignature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(toSign, secretKey));
  rapydSignature = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(rapydSignature));

  return {
    rapydRequestTimestamp,
    rapydSignatureSalt,
    rapydSignature,
  };
};

export const Rapyd = new RapydClient(process.env.SECRET_KEY, process.env.ACCESS_KEY);
