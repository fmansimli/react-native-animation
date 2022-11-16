import { NavigationContainer } from "@react-navigation/native";
import DrawerNav from "./DrawerNav";

const AppNav = () => {
  return (
    <NavigationContainer>
      <DrawerNav />
    </NavigationContainer>
  );
};

export default AppNav;
