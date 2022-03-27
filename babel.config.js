module.exports = {
  preset: [
    ["@babel/preset-env", {
      target: {
        node: 'current'
      }
    }],
    "@babel/preset-typescript"
  ]
}