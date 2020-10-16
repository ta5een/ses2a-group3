module.exports = {
  port: process.env.PORT || "4000",
  mongoUri: "mongodb+srv://admin:1w28D%25aYJU5gx%24rt@my-cluster.ckmew.mongodb.net/db?retryWrites=true&w=majority",
  jwtSecret: process.env.JWT_SECRET || "SECRET_TOKEN",
};
