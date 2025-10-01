module.exports = {
  apps: [
    {
      name: 'ypet-staging-front',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
