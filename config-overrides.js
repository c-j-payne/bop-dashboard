module.exports = function override(config, env) {
    // Add babel-loader to handle optional chaining in node_modules
    config.module.rules.push({
      test: /\.(js|mjs)$/,
      include: /node_modules\/@viamrobotics/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { targets: "defaults" }]
          ],
          plugins: [
            '@babel/plugin-proposal-optional-chaining'
          ]
        }
      }
    });
    
    return config;
  }