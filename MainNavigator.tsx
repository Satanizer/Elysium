import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Login} from './screens/Login';
import {Home} from './screens/Home';
import AddProduct from './screens/AddProduct';
import {Screens} from './misc/Screens';
import EditProduct from './screens/EditProduct';
import {ProductList} from './screens/ProductList';
import AddFolder from './screens/AddFolder';
import {MoveFolderList} from './screens/MoveFolderList';

const Stack = createStackNavigator<Screens>();

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AddProduct" component={AddProduct} />
        <Stack.Screen name="EditProduct" component={EditProduct} />
        <Stack.Screen name="ProductList" component={ProductList} />
        <Stack.Screen name="AddFolder" component={AddFolder} />
        <Stack.Screen name="MoveFolderList" component={MoveFolderList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
