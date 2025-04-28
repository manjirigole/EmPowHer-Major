const { withExpo } = require('@expo/next-adapter')
const withTM = require('next-transpile-modules')([
  'react-native-web',
  'solito',
  'dripsy',
  'moti',
  '@motify/skeleton',
  'app',
])

module.exports = withExpo(
  withTM({
    projectRoot: __dirname,
  })
)
