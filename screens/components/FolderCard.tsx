import storage from '@react-native-firebase/storage';
import React, {useEffect, useState} from 'react';
import {Image, Text, View} from 'react-native';
import {PLACEHOLDER_IMAGE_URL} from '../../misc/constants';

export interface FolderCardProps {
  id: string | null;
  name: string;
  imageName: string;
}

const FolderCard = ({name, imageName}: FolderCardProps) => {
  const [imageUrl, setImageUrl] = useState(PLACEHOLDER_IMAGE_URL);

  useEffect(() => {
    loadImage();
  });

  const loadImage = () => {
    console.log(imageName);
    storage()
      .ref(`files/${imageName}`)
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
        paddingVertical: 15,
        marginBottom: 18,
      }}>
      <Image
        source={{uri: imageUrl}}
        style={{
          width: 70,
          height: 70,
          borderRadius: 80,
          marginRight: 15,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 20,
          color: 'white',
          marginBottom: 3,
        }}>
        {name}
      </Text>
    </View>
  );
};

export default FolderCard;
