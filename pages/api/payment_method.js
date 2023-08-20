import { Rapyd } from "../../rapyd.js";

const endpointHandler = async (req, res) => {
  try {
    const { country, currency } = req.body;
    const response = await Rapyd.getPaymentMethodsByCountry(`/v1/payment_methods/country?country=${country}&currency=${currency}`);
    const data = response.data.filter((method) => method.category === "card");
    return res.status(200).json({ data });
  } catch ({ status, message }) {
    return res.status(status).json({ error: message });
  }
};

export default endpointHandler;
