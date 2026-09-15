import { catalogResponse } from '../server/kayco-catalog';

export default {
  fetch(request: Request): Promise<Response> {
    return catalogResponse(request.method);
  },
};
