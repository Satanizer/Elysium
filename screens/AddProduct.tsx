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

const AddProduct = () => {
  const {params} = useRoute<AddProductScreenNavigationProp>();
  const [namaBarang, setNamaBarang] = useState('');
  const [jenisBarang, setJenisBarang] = useState('');
  const [hargaBarang, setHargaBarang] = useState('');
  const [kuantitas, setKuantitas] = useState(0);
  const [pickedImage, setPickedImage] = useState<ImagePickerResponse>();
  const [isLoading, setIsLoading] = useState(false);

  const {goBack} = useNavigation();

  const handleAddQuantity = () => setKuantitas(prev => prev + 1);
  const handleReduceQuantity = () => {
    if (kuantitas > 0) {
      setKuantitas(prev => prev - 1);
    }
  };
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
    if (!namaBarang || !jenisBarang || !hargaBarang || !pickedImage) {
      Alert.alert('Harap mengisi semua form!');
      return;
    }

    try {
      setIsLoading(true);
      await firestore()
        .collection('products')
        .add({
          harga: hargaBarang,
          image: pickedImage?.assets?.at(0)?.fileName,
          jenis: jenisBarang,
          jumlah: kuantitas,
          nama: namaBarang,
          id_folder: params ?? null,
        });

      await storage()
        .ref(pickedImage?.assets?.at(0)?.fileName)
        .putFile(pickedImage?.assets?.at(0)?.uri);
      ToastAndroid.show('Produk Berhasil Ditambahkan', 3);
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
          value={namaBarang}
          onChangeText={setNamaBarang}
          placeholder="Nama Barang"
          style={{borderBottomWidth: 1, borderColor: 'gray', marginBottom: 5}}
        />
        <TextInput
          value={jenisBarang}
          onChangeText={setJenisBarang}
          placeholder="Jenis Barang"
          style={{borderBottomWidth: 1, borderColor: 'gray', marginBottom: 5}}
        />
        <TextInput
          value={hargaBarang}
          onChangeText={setHargaBarang}
          placeholder="Harga Barang"
          style={{borderBottomWidth: 1, borderColor: 'gray', marginBottom: 5}}
          keyboardType="numeric"
        />
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text>Kuantitas</Text>
            <Text style={{fontSize: 20}}>{kuantitas}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={handleAddQuantity}
              style={{
                backgroundColor: '#FF008A',
                width: 40,
                height: 40,
                alignItems: 'center',
                borderRadius: 10,
                marginRight: 10,
              }}>
              <Text style={{color: 'white', fontSize: 27}}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleReduceQuantity}
              style={{
                backgroundColor: '#FF008A',
                width: 40,
                height: 40,
                alignItems: 'center',
                borderRadius: 10,
              }}>
              <Text style={{color: 'white', fontSize: 27}}>-</Text>
            </TouchableOpacity>
          </View>
        </View>
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

export default AddProduct;
