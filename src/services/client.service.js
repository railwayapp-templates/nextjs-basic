const axios = require('axios');
const { sequelize } = require('../config/database');
const { initClientConfigModel } = require('../models/client-config.model');
const { encrypt, decrypt } = require('../utils/encryption.util');

const ClientConfig = initClientConfigModel(sequelize);

const normalizeDarkThemeColors = (payload) => {
  const darkTheme = payload?.data?.dark;

  if (!darkTheme) {
    return payload;
  }

  if (darkTheme.background == null) {
    darkTheme.background = '#000000';
  }

  if (darkTheme.black == null) {
    darkTheme.black = '#000000';
  }

  return payload;
};

const generateRandomHexColor = () => {
  const randomChannel = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  return `#${randomChannel()}${randomChannel()}${randomChannel()}`;
};

const randomizeDarkThemeColors = (payload) => {
  const transformedPayload = JSON.parse(JSON.stringify(payload));
  const darkTheme = transformedPayload?.data?.dark;

  if (!darkTheme || typeof darkTheme !== 'object') {
    return transformedPayload;
  }

  Object.keys(darkTheme).forEach((key) => {
    if (key === 'id') {
      return;
    }

    if (typeof darkTheme[key] === 'string') {
      darkTheme[key] = generateRandomHexColor();
    }
  });

  return transformedPayload;
};

const getAppStylingDetail = async (clientId) => {
  console.log("clientId",clientId)

  const clientConfig = await ClientConfig.findOne({
    where: {
      clientCode: clientId,
    },
  });

  if (!clientConfig) {
    const error = new Error('Client config not found');
    error.response = {
      status: 404,
      data: {
        message: `No client config found for clientId: ${clientId}`,
      },
    };
    throw error;
  }
  console.log("clientConfig=====",clientConfig)

  const token = decrypt(clientConfig.strapiAuthToken);

  if (!token) {
    throw new Error('Client strapi auth token is not configured');
  }

  const endpoint = clientConfig.starpiurl;
  console.log("endpoint=====",endpoint);
    console.log("token=====",token);


  if (!endpoint) {
    throw new Error('Client strapi url is not configured');
  }

  const queryParams = new URLSearchParams({
    populate: '*',
  });
  const url = `${endpoint}api/app-styling-detail/?${queryParams.toString()}`;
  console.log("url====>>>",url);

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const normalizedData = normalizeDarkThemeColors(response.data);
  
  // Add the additional fields to the response
  return {
    ...normalizedData,
    railwayUrl: clientConfig.railwayUrl,
    chatApiKey: decrypt(clientConfig.chatApiKey),
  };
};

const createClientConfig = async ({
  clientCode,
  starpiurl,
  railwayUrl,
  chatApiKey,
  chatApiKeySecret,
  strapiAuthToken,
}) => {
  const existingClientConfig = await ClientConfig.findOne({
    where: {
      clientCode,
    },
  });

  if (existingClientConfig) {
    return {
      alreadyExists: true,
      data: existingClientConfig,
    };
  }

  const createdClientConfig = await ClientConfig.create({
    clientCode,
    starpiurl,
    railwayUrl,
    chatApiKey: encrypt(chatApiKey),
    chatApiKeySecret: encrypt(chatApiKeySecret),
    strapiAuthToken: encrypt(strapiAuthToken),
  });

  return {
    alreadyExists: false,
    data: createdClientConfig,
  };
};

const getAppStylingDetailV2 = async (clientId) => {
  const token = process.env.STRAPI_AUTH_TOKEN;

  if (!token) {
    throw new Error('STRAPI_AUTH_TOKEN is not configured');
  }

  const clientConfig = await ClientConfig.findOne({
    where: {
      clientCode: clientId,
    },
  });

  if (!clientConfig) {
    const error = new Error('Client config not found');
    error.response = {
      status: 404,
      data: {
        message: `No client config found for clientId: ${clientId}`,
      },
    };
    throw error;
  }

  const endpoint = clientConfig.starpiurl;

  if (!endpoint) {
    throw new Error('Client strapi url is not configured');
  }

  const queryParams = new URLSearchParams({
    populate: '*',
  });
  const url = `${endpoint}api/app-styling-detail/?${queryParams.toString()}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return randomizeDarkThemeColors(normalizeDarkThemeColors(response.data));
};

const getClientConfigDetails = async (clientCode) => {
  const clientConfig = await ClientConfig.findOne({
    where: {
      clientCode,
    },
  });

  if (!clientConfig) {
    const error = new Error('Client config not found');
    error.response = {
      status: 404,
      data: {
        message: `No client config found for clientCode: ${clientCode}`,
      },
    };
    throw error;
  }

  return {
    id: clientConfig.id,
    clientCode: clientConfig.clientCode,
    starpiurl: clientConfig.starpiurl,
    railwayUrl: clientConfig.railwayUrl,
    strapiAuthToken: decrypt(clientConfig.strapiAuthToken),
    chatApiKey: decrypt(clientConfig.chatApiKey),
    chatApiKeySecret: decrypt(clientConfig.chatApiKeySecret),
  };
};

module.exports = {
  getAppStylingDetail,
  createClientConfig,
  getAppStylingDetailV2,
  getClientConfigDetails,
};
