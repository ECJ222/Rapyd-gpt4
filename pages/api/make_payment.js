import { Rapyd } from "../../rapyd.js";

const endpointHandler = async (req, res) => {
  try {
    const response = await Rapyd.createPayment(`/v1/payments`, req.body);

    const data = response.data;

    return res.status(200).json({ data });
  } catch ({ status, message }) {
    return res.status(status).json({ error: message });
  }
};

export default endpointHandler;
