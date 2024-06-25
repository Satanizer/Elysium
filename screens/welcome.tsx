import {NavigationProp, useNavigation} from '@react-navigation/native';
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Screens} from '../misc/Screens';

const Welcome = () => {
  const {navigate} = useNavigation<NavigationProp<Screens>>();

  const handleOnContinue = () => {
    navigate('Home');
  };

  return (
    <ImageBackground
      source={require('../assets/welcome_bg.png')}
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
      }}>
      <View
        style={{
          width: '100%',
          paddingHorizontal: 24,
        }}>
        <Text
          style={{
            color: 'black',
            fontWeight: 'bold',
            fontSize: 24,
            textAlign: 'center',
            marginBottom: 20,
          }}>
          Welcome
        </Text>
        <TouchableOpacity
          onPress={handleOnContinue}
          style={{
            height: 50,
            borderRadius: 10,
            backgroundColor: '#FF008A',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{color: 'white'}}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Welcome;
