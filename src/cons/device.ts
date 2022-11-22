import { Dimensions, Platform } from "react-native";
import * as Device from "expo-device";

const { width, height } = Dimensions.get("window");

export default {
  width,
  height,
  isSmall: width < 375,
  OS: Platform.OS,
  info: `${Device.osName} (${Device.osVersion}) `,
  osVersion: Device.osVersion,
};
