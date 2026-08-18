const {
  getAppStylingDetail,
  createClientConfig,
  getAppStylingDetailV2,
  getClientConfigDetails,
} = require('../services/client.service');

const fetchAppStylingDetail = async (req, res) => {
  try {
    const { clientCode } = req.query;

    if (!clientCode) {
      return res.status(400).json({
        message: 'clientId query param is required',
      });
    }

    const data = await getAppStylingDetail(clientCode);
    return res.status(200).json(data);
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const details = error.response?.data || error.message;

    return res.status(statusCode).json({
      message: 'Failed to fetch app styling detail from Strapi',
      details,
    });
  }
};

const addClientConfig = async (req, res) => {
  try {
    console.log("req",req.body);
    const { clientCode, starpiurl, railwayUrl, chatApiKey, chatApiKeySecret, strapiAuthToken } = req.body;

    if (!clientCode || !starpiurl || !railwayUrl) {
      return res.status(400).json({
        message: 'clientCode, starpiurl and railwayUrl are required',
      });
    }

    const result = await createClientConfig({
      clientCode,
      starpiurl,
      railwayUrl,
      chatApiKey,
      chatApiKeySecret,
      strapiAuthToken,
    });

    if (result.alreadyExists) {
      return res.status(409).json({
        message: 'ClientCode already exists',
        data: result.data,
      });
    }

    return res.status(201).json({
      message: 'Client config created successfully',
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to create client config',
      details: error.message,
    });
  }
};

const fetchAppStylingDetailV2 = async (req, res) => {
  try {
    const { clientCode } = req.query;

    if (!clientCode) {
      return res.status(400).json({
        message: 'clientId query param is required',
      });
    }

    const data = await getAppStylingDetailV2(clientCode);
    return res.status(200).json(data);
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const details = error.response?.data || error.message;

    return res.status(statusCode).json({
      message: 'Failed to fetch app styling detail from Strapi',
      details,
    });
  }
};

const fetchClientConfigDetails = async (req, res) => {
  try {
    const { clientCode } = req.query;

    if (!clientCode) {
      return res.status(400).json({
        message: 'clientCode query param is required',
      });
    }

    const data = await getClientConfigDetails(clientCode);

    return res.status(200).json({
      message: 'Client config fetched successfully',
      data,
    });
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const details = error.response?.data || error.message;

    return res.status(statusCode).json({
      message: 'Failed to fetch client config details',
      details,
    });
  }
};

module.exports = {
  fetchAppStylingDetail,
  addClientConfig,
  fetchAppStylingDetailV2,
  fetchClientConfigDetails,
};
