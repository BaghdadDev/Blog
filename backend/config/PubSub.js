const { RedisPubSub } = require("graphql-redis-subscriptions");
const Redis = require("ioredis");

/*
 - For production environment we need to use Redis :
 because PubSub's event-publishing system is in-memory.
 This means that events published by one instance of your GraphQL server
 are not received by subscriptions that are handled by other instances.
 *** To lunch Redis => CLI:
 * ubuntu
 * sudo service redis-server start
 * redis-cli
 * 127.0.0.1:6379> ping
 * PONG

 */

const options = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_HOST_PORT || 6379,
  retryStrategy: (times) => {
    // reconnect after
    return Math.min(times * 50, 2000);
  },
};

module.exports = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options),
});
