import firestore, {firebase} from '@react-native-firebase/firestore';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {MoveFolderListScreenNavigationProp, Screens} from '../misc/Screens';
import FolderCard, {FolderCardProps} from './components/FolderCard';

export const MoveFolderList = () => {
  const {navigate} = useNavigation<NavigationProp<Screens>>();
  const [isSearchbarVisible, setIsSearchBarVisible] = useState(false);
  const [search, setSearch] = useState('');
  const route = useRoute<MoveFolderListScreenNavigationProp>();

  const folders = [...route.params.folders];

  const {goBack} = useNavigation();
  const updateFolder = async (id: string, folderID: string) => {
    await firestore().collection('products').doc(id).update({
      id_folder: folderID,
    });

    ToastAndroid.show('Produk berhasil ditambahkan ke dalam folder', 3);
    goBack();
  };

  folders.unshift({
    id: null,
    name: 'Tanpa Folder',
    imageName: 'no_folder.png',
  });

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
            PINDAHKAN PRODUK
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
        data={folders.filter(item =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        )}
        ListEmptyComponent={
          <Text style={{width: 300, textAlign: 'center', alignSelf: 'center'}}>
            {folders.length === 0
              ? 'Silahkan membuat folder atau item baru'
              : `Tidak ditemukan '${search}'`}
          </Text>
        }
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                updateFolder(route.params.id, item.id);
              }}>
              <FolderCard {...item} />
            </TouchableOpacity>
          );
        }}
        style={{
          backgroundColor: '#ffccec',
          flex: 1,
          paddingTop: 24,
        }}
      />
    </View>
  );
};
