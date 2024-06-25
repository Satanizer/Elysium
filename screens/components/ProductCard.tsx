import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {PLACEHOLDER_IMAGE_URL} from '../../misc/constants';

export interface ProductCardProps {
  name: string;
  type: string;
  quantity: number;
  price: number;
  id: string;
  imageName: string;
  folderId: string;
}

const ProductCard = ({
  name,
  type,
  quantity,
  price,
  id,
  imageName,
}: ProductCardProps) => {
  const [imageUrl, setImageUrl] = useState(PLACEHOLDER_IMAGE_URL);

  useEffect(() => {
    loadImage();
  });

  const loadImage = () => {
    console.log('in product card: ', imageName);
    storage()
      .ref(imageName)
      .getDownloadURL()
      .then(url => setImageUrl(url))
      .catch(err => console.log(err));
  };

  return (
    <View
      style={{
        paddingHorizontal: 20,
        backgroundColor: '#FF008A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        marginBottom: 18,
      }}>
      <View style={{flexDirection: 'row'}}>
        <Image
          source={{uri: imageUrl}}
          style={{width: 70, height: 70, borderRadius: 80, marginRight: 15}}
        />
        <View>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              color: 'white',
              marginBottom: 3,
            }}>
            {name}
          </Text>
          <Text style={{fontSize: 12, color: 'white', maxWidth: 200}}>
            {type}
          </Text>
          <Text style={{fontSize: 12, color: 'white', maxWidth: 200}}>
            Harga: Rp{price}
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: '#1E1E1E',
          padding: 6,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 50,
          marginLeft: 30,
        }}>
        <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>
          {quantity}
        </Text>
      </View>
    </View>
  );
};

export default ProductCard;
