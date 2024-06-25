import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Text,
  TextInput,
  ToastAndroid,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ProductListScreenNavigationProp, Screens} from '../misc/Screens';
import ProductCard, {ProductCardProps} from './components/ProductCard';
import Modal from 'react-native-modal';

export const ProductList = () => {
  const {params} = useRoute<ProductListScreenNavigationProp>();
  const {navigate, goBack} = useNavigation<NavigationProp<Screens>>();
  const [isSearchbarVisible, setIsSearchBarVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const filteredProducts = products.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductCardProps | null>(null);

  const handleAddProduct = () => {
    navigate('AddProduct', params.id);
  };

  useFocusEffect(
    useCallback(() => {
      console.log('this folder id is =', params.id);
      fetchAllData();
    }, []),
  );

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const products = await firestore()
        .collection('products')
        .where('id_folder', '==', params.id)
        .get();

      const mappedProductsData = products.docs.map((item): ProductCardProps => {
        const data = item.data();
        return {
          id: item.id,
          name: data.nama,
          imageName: data.image,
          type: data.jenis,
          quantity: data.jumlah,
          price: data.harga,
          folderId: data.id_folder,
        };
      });

      setProducts(mappedProductsData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string, imageName: string) => {
    try {
      setIsLoading(true);
      await storage().ref(imageName).delete();
      await firestore().collection('products').doc(id).delete();
      fetchAllData();
      ToastAndroid.show('Produk Berhasil Dihapus', 3);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (id: string, imageName: string) => {
    Alert.alert(
      'Hapus Produk',
      'Apakah Anda yakin untuk menghapus produk ini?',
      [
        {
          onPress: () => deleteProduct(id, imageName),
          text: 'Hapus',
        },
        {text: 'Batal'},
      ],
    );
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          backgroundColor: '#FF008A',
          justifyContent: 'center',
          paddingHorizontal: 24,
          paddingVertical: 14,
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            flexDirection: 'row',
          }}>
          <TouchableOpacity onPress={goBack}>
            <Image
              source={require('../assets/back_arrow.png')}
              style={{width: 18, height: 18}}
            />
          </TouchableOpacity>
          <Text style={{fontWeight: 'bold', color: 'white', fontSize: 20}}>
            ELYSIUM
          </Text>
          <TouchableOpacity
            onPress={() => {
              setIsSearchBarVisible(prev => !prev);
            }}>
            <Image
              source={require('../assets/search.png')}
              style={{width: 18, height: 18}}
            />
          </TouchableOpacity>
        </View>
        {isSearchbarVisible ? (
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Cari naon..."
            style={{
              marginTop: 22,
              backgroundColor: 'white',
              borderRadius: 2,
              height: 45,
              paddingHorizontal: 20,
            }}
          />
        ) : null}
      </View>
      <FlatList
        data={filteredProducts}
        ListEmptyComponent={
          <Text style={{width: 300, textAlign: 'center', alignSelf: 'center'}}>
            {filteredProducts.length === 0
              ? 'Silahkan membuat item baru'
              : `Tidak ditemukan '${search}'`}
          </Text>
        }
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => navigate('EditProduct', item)}
              onLongPress={() => {
                setSelectedProduct(item);
                setShowModal(true);
              }}>
              <ProductCard {...item} />
            </TouchableOpacity>
          );
        }}
        style={{
          backgroundColor: '#ffccec',
          flex: 1,
          paddingTop: 24,
        }}
      />
      <TouchableOpacity
        onPress={handleAddProduct}
        style={{
          backgroundColor: '#FF008A',
          right: 24,
          width: 60,
          height: 60,
          bottom: 20,
          borderRadius: 100,
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../assets/plus_icon.png')}
          style={{width: 30, height: 30}}
        />
      </TouchableOpacity>
      <Modal
        isVisible={showModal}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        onBackButtonPress={() => setShowModal(false)}
        onBackdropPress={() => setShowModal(false)}
        onDismiss={() => setShowModal(false)}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: 'white',
              width: '90%',
              padding: 20,
              borderRadius: 10,
              gap: 20,
            }}>
            <TouchableNativeFeedback
              onPress={() => {
                confirmDelete(selectedProduct?.id, selectedProduct?.imageName);
                setShowModal(false);
              }}>
              <Text>Hapus</Text>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
              onPress={() => {
                navigate('MoveFolderList', {
                  id: selectedProduct?.id,
                  folders: params.folders,
                });
              }}>
              <Text>Pindahkan ke folder</Text>
            </TouchableNativeFeedback>
          </View>
        </View>
      </Modal>
    </View>
  );
};
