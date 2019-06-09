module.exports = {
  presets: [
    '@vue/app'
  ],
  publicPath: process.env.NODE_ENV === 'production'
    ? '/Operating_System_MemAlloc/'
    : '/'
}
