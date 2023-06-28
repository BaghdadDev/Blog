const { RedisPubSub } = require("graphql-redis-subscriptions");
const Redis = require("ioredis");
const { PubSub } = require("graphql-subscriptions");

/*
 - For production environment we need to use Redis :
 because PubSub's event-publishing system is in-memory.
 This means that events published by one instance of your GraphQL server
 are not received by subscriptions that are handled by other instances.
 *** To lunch Redis => CLI:
 * ubuntu
 * sudo service redis-server start
 * Password: 1234
 * redis-cli
 * 127.0.0.1:6379> ping
 * PONG

 */

if (process.env.NODE_ENV === "production") {
  const options = {
    host: "127.0.0.1",
    port: 6379,
    retryStrategy: (times) => {
      return Math.min(times * 50, 2000);
    },
  };
  module.exports = new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options),
  });
} else {
  module.exports = new PubSub();
}
