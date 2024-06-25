import React, {useEffect} from 'react';
import MainNavigator from './MainNavigator';
import BootSplash from 'react-native-bootsplash';

function App(): React.JSX.Element {
  useEffect(() => {
    BootSplash.hide();
  }, []);
  return <MainNavigator />;
}

export default App;
