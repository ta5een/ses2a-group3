const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'YOUR_secret_key',
  mongoUri: process.env.MONGODB_URI || 'mongodb+srv://root:root123@study-group-webapp.dkasc.mongodb.net/<dbname>?retryWrites=true&w=majority',
}

export default config;
