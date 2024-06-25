import {
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Spinner from 'react-native-loading-spinner-overlay';
import {AddProductScreenNavigationProp} from '../misc/Screens';

const AddFolder = () => {
  const {params} = useRoute<AddProductScreenNavigationProp>();
  const [namaFolder, setNamaFolder] = useState('');
  const [pickedImage, setPickedImage] = useState<ImagePickerResponse>();
  const [isLoading, setIsLoading] = useState(false);

  const {goBack} = useNavigation();

  const handlePickImage = async () => {
    try {
      const picked = await launchImageLibrary({mediaType: 'photo'});
      if (!picked.didCancel) {
        setPickedImage(picked);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addProduct = async () => {
    if (!namaFolder || !pickedImage) {
      Alert.alert('Harap mengisi semua form!');
      return;
    }

    try {
      setIsLoading(true);
      await firestore()
        .collection('folders')
        .add({
          image: pickedImage?.assets?.at(0)?.fileName,
          nama: namaFolder,
        });

      await storage()
        .ref(`files/${pickedImage?.assets?.at(0)?.fileName}`)
        .putFile(pickedImage?.assets?.at(0)?.uri);
      goBack();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log(params);
  }, []);

  return (
    <View style={{flex: 1}}>
      <Spinner visible={isLoading} />
      <View
        style={{
          backgroundColor: '#FF008A',
          height: 55,
          paddingHorizontal: 14,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={goBack}>
          <Image
            source={require('../assets/back_arrow.png')}
            style={{width: 18, height: 18}}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={addProduct}>
          <Image
            source={require('../assets/save.png')}
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: '#ffccec',
          flex: 1,
          paddingHorizontal: 14,
          paddingTop: 10,
        }}>
        <TextInput
          value={namaFolder}
          onChangeText={setNamaFolder}
          placeholder="Nama Folder"
          style={{borderBottomWidth: 1, borderColor: 'gray', marginBottom: 5}}
        />
        <TouchableOpacity style={{marginTop: 30}} onPress={handlePickImage}>
          <Image
            source={
              pickedImage
                ? {uri: pickedImage.assets?.at(0)?.uri}
                : require('../assets/add_image.png')
            }
            style={{
              width: '100%',
              height: 200,
              borderRadius: 1,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddFolder;
