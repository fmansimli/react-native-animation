import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen, { homeOptions } from "screens/HomeScreen";
import MeetScreen, { meetOptions } from "screens/MeetScreen";

const Drawer = createDrawerNavigator();

const DrawerNav = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} options={homeOptions} />
      <Drawer.Screen name="Meet" component={MeetScreen} options={meetOptions} />
    </Drawer.Navigator>
  );
};

export default DrawerNav;
