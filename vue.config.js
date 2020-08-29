//可以在这里创建一个文件来自己修改配置
module.exports = {
  // 使用vue-cli3打包项目，通过配置不同的指令给项目设置不一样的配置。
  // npm run serve时会把process.env.NODE_ENV设置为‘development’；
  // npm run build 时会把process.env.NODE_ENV设置为‘production’；
  publicPath: process.env.NODE_ENV === 'production'? './': '/'
}