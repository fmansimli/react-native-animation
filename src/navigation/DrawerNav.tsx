import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen, { homeOptions } from "screens/HomeScreen";
import MeetScreen, { meetOptions } from "screens/MeetScreen";
import { drawerScreenOptions } from "./options/drawer";

const Drawer = createDrawerNavigator();

const DrawerNav = () => {
  return (
    <Drawer.Navigator screenOptions={drawerScreenOptions}>
      <Drawer.Screen name="Home" component={HomeScreen} options={homeOptions} />
      <Drawer.Screen name="Meet" component={MeetScreen} options={meetOptions} />
    </Drawer.Navigator>
  );
};

export default DrawerNav;
