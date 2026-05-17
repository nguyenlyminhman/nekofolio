module.exports = {
  apps: [
    {
      name: "nekofolio-ui",
      script: "npm",
      args: "start",
      cwd: "/home/ubuntu/apps/nekofolio-ui",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};