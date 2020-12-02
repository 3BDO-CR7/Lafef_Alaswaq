import React, { Component }                from 'react';
import { View, AsyncStorage, I18nManager,Platform} from 'react-native';
import   {Root}                            from 'native-base';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistedStore } from './src/store';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import Routes from './src/RootNavigator'
import './ReactotronConfig';


export default class App extends Component {

  constructor(props){
    super(props);
    this.loadFontAsync();
    this.state = {
      fontLoaded: false
    };
      console.disableYellowBox = true;

  }

    async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
     // AsyncStorage.clear();
        if (Platform.OS === 'android') {
            Notifications.createChannelAndroidAsync('orders_najran', {
                name: 'Chat messages',
                sound: true,
            });
        }
  }

  async loadFontAsync() { try
    {
      await Font.loadAsync({ CairoRegular: require("./assets/fonts/Cairo-Regular.ttf") });
      await Font.loadAsync({ CairoBold: require("./assets/fonts/Cairo-Bold.ttf") });
      this.setState({ fontLoaded: true });
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    if (!this.state.fontLoaded) {
      return <View />;
    }
    return (

        <Provider store={store} UNSAFE_readLatestStoreStateOnFirstRender={true}>
              <PersistGate persistor={persistedStore}>
              <Root>
                  <Routes/>
              </Root>
             </PersistGate>
      </Provider>
    );
  }
}



