import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen, { homeOptions } from "screens/HomeScreen";

const Drawer = createDrawerNavigator();

const DrawerNav = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} options={homeOptions} />
    </Drawer.Navigator>
  );
};

export default DrawerNav;
