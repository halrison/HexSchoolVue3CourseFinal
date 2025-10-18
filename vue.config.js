const path = require( 'path' )
module.exports = {
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/HexSchoolVue3CourseFinal/' : '/',
configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, 'src')
      },
      extensions: ['.js', '.vue', '.json']
    }
  }
}