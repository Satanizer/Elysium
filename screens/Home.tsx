import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  Alert,
  Button,
  FlatList,
  Image,
  Text,
  TextInput,
  ToastAndroid,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Screens} from '../misc/Screens';
import FolderCard, {FolderCardProps} from './components/FolderCard';
import ProductCard, {ProductCardProps} from './components/ProductCard';
import Modal from 'react-native-modal';

export const Home = () => {
  const [selectedProduct, setSelectedProduct] =
    useState<ProductCardProps | null>(null);
  const {navigate} = useNavigation<NavigationProp<Screens>>();
  const [isSearchbarVisible, setIsSearchBarVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [folders, setFolders] = useState<FolderCardProps[]>([]);
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [searchItems, setSearchItems] = useState<ProductCardProps[]>([]);
  const listItems = isSearchbarVisible
    ? searchItems
    : [...folders, ...products];
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleAddProduct = () => {
    navigate('AddProduct', null);
  };

  const handleAddFolder = () => {
    navigate('AddFolder');
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllData();
    }, []),
  );

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const folders = await firestore().collection('folders').get();
      const products = await firestore()
        .collection('products')
        .where('id_folder', '==', null)
        .get();

      const allProducts = await firestore().collection('products').get();

      const mappedFolderData = folders.docs.map((item): FolderCardProps => {
        const data = item.data();
        console.log('folder ids:', item.id);
        return {
          id: item.id,
          name: data.nama,
          imageName: data.image,
        };
      });

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

      const mappedAllProductsData = allProducts.docs.map(
        (item): ProductCardProps => {
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
        },
      );

      setSearchItems(mappedAllProductsData);
      setProducts(mappedProductsData);
      setFolders(mappedFolderData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (
    collectionName: string,
    id: string,
    imageName: string,
  ) => {
    try {
      setIsLoading(true);
      await firestore().collection(collectionName).doc(id).delete();
      fetchAllData();
      await storage().ref(imageName).delete();
      ToastAndroid.show('Produk Berhasil Dihapus', 3);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFolder = async (id: string) => {
    const products = (
      await firestore()
        .collection('products')
        .where('id_folder', '==', id)
        .get()
    ).docs.map(item => ({id: item.id, image: item.data().image}));

    for (const product of products) {
      setIsLoading(true);
      await firestore().collection('products').doc(product.id).delete();
      await storage().ref(product.image).delete();
    }

    await firestore().collection('folders').doc(id).delete();
    fetchAllData();
  };

  const confirmDeleteProduct = (id: string, imageName: string) => {
    Alert.alert(
      'Hapus Produk',
      'Apakah Anda yakin untuk menghapus produk ini?',
      [
        {
          onPress: () => deleteProduct('products', id, imageName),
          text: 'Hapus',
        },
        {text: 'Batal'},
      ],
    );
  };

  const confirmDeleteFolder = (id: string) => {
    Alert.alert(
      'Hapus Folder',
      'Apakah Anda yakin untuk menghapus folder ini? Semua produk dalam folder ini akan dihapus',
      [
        {
          onPress: () => deleteFolder(id),
          text: 'Hapus Folder berserta Produknya',
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
          <TouchableOpacity onPress={() => {}}>
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
        data={listItems.filter(item =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        )}
        ListEmptyComponent={
          <Text style={{width: 300, textAlign: 'center', alignSelf: 'center'}}>
            {folders.length === 0
              ? 'Silahkan membuat folder atau item baru'
              : `Tidak ditemukan '${search}'`}
          </Text>
        }
        renderItem={({item, index}) => {
          return item.type === undefined ? (
            <TouchableOpacity
              onPress={() =>
                navigate('ProductList', {id: item.id, folders: folders})
              }
              onLongPress={() => confirmDeleteFolder(item.id)}>
              <FolderCard {...item} />
            </TouchableOpacity>
          ) : (
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
      <TouchableOpacity
        onPress={handleAddFolder}
        style={{
          backgroundColor: '#FF008A',
          right: 90,
          width: 60,
          height: 60,
          bottom: 20,
          borderRadius: 100,
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../assets/folder_with_plus.png')}
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
                confirmDeleteProduct(
                  selectedProduct?.id,
                  selectedProduct?.imageName,
                );
                setShowModal(false);
              }}>
              <Text>Hapus</Text>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
              onPress={() => {
                navigate('MoveFolderList', {
                  id: selectedProduct?.id,
                  folders: folders,
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
