const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'SECRET_TOKEN',
  mongoUri: process.env.MONGODB_URI || 'mongodb+srv://root:root123@study-group-webapp.dkasc.mongodb.net/group-interest?retryWrites=true&w=majority',
}

export default config;
