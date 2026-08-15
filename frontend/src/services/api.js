import api from "../api/api";

export const apiRequest = async (endpoint, options = {}) => {
  const { body, data, headers, ...config } = options;

  try {
    const response = await api.request({
      url: endpoint,
      ...config,
      ...(data !== undefined ? { data } : {}),
      ...(body !== undefined && data === undefined ? { data: body } : {}),
      headers: {
        ...headers,
      },
    });

    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    throw new Error(message);
  }
};

export default api;
