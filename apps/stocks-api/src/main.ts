/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';
const Wreck = require('@hapi/wreck');

const init = async () => {

  const server = new Server({
    port: 3333,
    host: 'localhost'
  });

  const get = async (apiURL, symbol, period, token) => {
    let url = `${decodeURIComponent(apiURL)}/beta/stock/${symbol}/chart/${period}?token=${token}`;
    const { res, payload } = await Wreck.get(url);
    return payload.toString()
  };

  server.method('stocks', get, {
    cache: {
      expiresIn: 10 * 1000,
      generateTimeout: 10000
    }
  });


  server.route({
    method: 'GET',
    path: '/stocks/{apiURL}/{symbol}/{period}/{token}',
    handler: async (request, h) => {
      const { apiURL, symbol, period, token } = request.params;
      return await server.methods.stocks(apiURL, symbol, period, token);
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
