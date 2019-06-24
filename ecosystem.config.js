module.exports = {
  apps: [{
    name: 'es6SwaggerBoilerplate',
    script: 'bin/start',
    autorestart: true,
    watch: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
    env_staging: {
      NODE_ENV: 'staging',
    }
  }]
};
