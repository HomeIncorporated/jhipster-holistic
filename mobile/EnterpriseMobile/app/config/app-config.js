// Simple React Native specific changes
import { Platform } from 'react-native'

export default {
  // this is your UAA's base name, lower-cased and followed by a /
  uaaBaseUrl: 'services/enterpriseapp/',
  // use 10.0.2.2 for Android to connect to host machine
  apiUrl: Platform.OS === 'ios' ? 'http://localhost:8080/' : 'http://10.0.2.2:8080/',
  appUrlScheme: 'enterprisemobile',
}
