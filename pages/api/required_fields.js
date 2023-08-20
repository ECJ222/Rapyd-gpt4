import { Rapyd } from "../../rapyd.js";

const endpointHandler = async (req, res) => {
  try {
    const { type } = req.body;
    const response = await Rapyd.getRequiredFieldsByPaymentMethod(`/v1/payment_methods/required_fields/${type}`);
    const data = response.data;
    return res.status(200).json({ data });
  } catch ({ status, message }) {
    return res.status(status).json({ error: message });
  }
};

export default endpointHandler;
