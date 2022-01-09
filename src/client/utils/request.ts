import { extend, ResponseError } from 'umi-request';
import { message } from 'antd';

import type { ResponseJsonType } from '../../common/request';

class ResError extends Error {
  response: Response;
  type: string;
  data: any;

  constructor(
    response: Response,
    text: string,
    data: string,
    type = 'ResponseError',
  ) {
    super(text || response.statusText);
    this.name = 'ResponseError';
    this.response = response;
    this.type = type;
    this.data = data;
  }
}

const extendRequest = extend({
  errorHandler(
    error: ResponseError & { response: Response & ResponseJsonType },
  ) {
    message.error(error.response.message);
    throw new ResError(error.response, error.response.message, null);
  },
});

extendRequest.interceptors.request.use((url, options) => {
  return {
    url,
    options: {
      ...{
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
      ...options,
    },
  };
});

extendRequest.interceptors.response.use(async (response: Response) => {
  let finalRes: any;
  try {
    finalRes = await response.clone().json();
  } catch (err) {
    throw new ResError(finalRes, `接口${response.url}返回数据不对`, null);
  }
  if (finalRes?.code !== 0) {
    throw new ResError(finalRes, finalRes?.message, null);
  }
  return response;
});

export default extendRequest;