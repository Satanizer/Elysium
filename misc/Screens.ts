import {RouteProp} from '@react-navigation/native';
import {ProductCardProps} from '../screens/components/ProductCard';
import {FolderCardProps} from '../screens/components/FolderCard';

export type Screens = {
  Login: undefined;
  Welcome: undefined;
  Home: undefined;
  AddProduct: {
    id: string | null;
  };
  EditProduct: ProductCardProps;
  ProductList: {
    id: string;
    folders: FolderCardProps[];
  };
  AddFolder: undefined;
  MoveFolderList: {
    id: string;
    folders: FolderCardProps[];
  };
};

export type EditProductScreenNavigationProp = RouteProp<Screens, 'EditProduct'>;
export type ProductListScreenNavigationProp = RouteProp<Screens, 'ProductList'>;
export type AddProductScreenNavigationProp = RouteProp<Screens, 'AddProduct'>;
export type MoveFolderListScreenNavigationProp = RouteProp<
  Screens,
  'MoveFolderList'
>;
