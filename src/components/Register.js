import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    AsyncStorage,
    Alert,
    View,
    Image,
    KeyboardAvoidingView,
    ActivityIndicator, TouchableOpacity
} from 'react-native';
import {
    Container,
    Content,
    Form,
    Item,
    Input,
    Label,
    Icon,
    Title,
    Picker,
    Button,
    Toast,
    Body,
    Left,
    Right, Header
} from 'native-base'

import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from "expo-constants";

import I18n from "ex-react-native-i18n";
import axios from "axios";
import Spinner from "react-native-loading-spinner-overlay";
import {Bubbles} from "react-native-loader";
import {connect} from "react-redux";
const  base_url = 'http://plus.4hoste.com/api/';
import CONST from '../consts';
import styles from '../../assets/style'
import * as Animatable from "react-native-animatable";

class Register extends Component {

    constructor(props) {
        super(props);

         this.state  = {
            en_message   : 'please complete all required data',
            ar_message   : 'برجآء تأكد من إدخال جميع البيانات',
            key : null,
            cities: [],
             codes: [],
            countries : [],
            is_password: false,
            cf_password:null ,
            is_email: false,
            email :'' ,
            spinner: false,
            phone : '',
            lang : this.props.lang,
            country_id: 1,
            password : '',
            city_id : null ,
            name : '' ,
            files : null,
            isLoaded : false,
            text: null,
            selected2   : undefined,
            image  : null,
            nameStatus: 0,
            phoneStatus: 0,
            emailStatus: 0,
            passwordStatus: 0,
            confirmStatus: 0,
         };
     }

    activeInput(type) {

        if (type === 'name' || this.state.name !== '') {
            this.setState({nameStatus: 1})
        }

        if (type === 'phone' || this.state.phone !== '') {
            this.setState({phoneStatus: 1})
        }

        if (type === 'email' || this.state.email !== '') {
            this.setState({emailStatus: 1})
        }

        if (type === 'password' || this.state.password !== '') {
            this.setState({passwordStatus: 1})
        }

        if (type === 'confirmPassword' || this.state.confirmPassword !== '') {
            this.setState({confirmPasswordStatus: 1})
        }

    }

    unActiveInput(type) {

        if (type === 'name' && this.state.name === '') {
            this.setState({nameStatus: 0})
        }

        if (type === 'phone' && this.state.phone === '') {
            this.setState({phoneStatus: 0})
        }

        if (type === 'email' && this.state.email === '') {
            this.setState({emailStatus: 0})
        }

        if (type === 'password' && this.state.password === '') {
            this.setState({passwordStatus: 0})
        }

        if (type === 'confirmPassword' && this.state.confirmPassword === '') {
            this.setState({confirmPasswordStatus: 0})
        }

    }

      componentWillMount() {

           this.setState({spinner: true});
           axios.post(`${CONST.url}countries`, { lang: this.props.lang  })
              .then( (response)=> {
                  this.setState({countries: response.data.data});

                  axios.post(`${CONST.url}cities`, { lang: this.props.lang , country_id: this.state.country_id })
                      .then( (response)=> {

                          this.setState({cities: response.data.data});
                          this.setState({city_id: response.data.data[0].id});


                          axios.post(`${CONST.url}codes`, { lang: this.props.lang  })
                              .then( (response)=> {
                                  this.setState({codes: response.data.data});
                                  this.setState({key: response.data.data[0]});
                              })
                              .catch( (error)=> {
                                  this.setState({spinner: false});
                              }).then(()=>{
                              this.setState({spinner: false});
                          });

                      }).catch( (error)=> {
                          this.setState({spinner: false});
                      }).then(()=>{
                      this.setState({spinner: false});
                  });
              }).catch( (error)=> {
                  this.setState({spinner: false});
              })

      }

      componentDidMount() {
        this.getPermissionAsync();
      }

    getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

    _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64:      true,
      aspect: [4, 3],
    });

    this.setState({files: result.base64});

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

    onValueChange(value) {
    this.setState({ country_id: value});
    setTimeout(()=>{

          this.setState({spinner: true});
          axios.post(`${CONST.url}cities`, { lang: this.props.lang , country_id: this.state.country_id })
              .then( (response)=> {
                  this.setState({cities: response.data.data});
                  this.setState({city_id: response.data.data[0].id});
                  axios.post(`${CONST.url}choose_codes`, { lang: this.props.lang , country_id: this.state.country_id })
                      .then( (response)=> {
                          this.setState({key:response.data.data})
                      })
                      .catch( (error)=> {
                          this.setState({spinner: false});
                      }).then(()=>{
                      this.setState({spinner: false});
                  }).then(()=>{
                      this.setState({spinner: false});
                  });

              }).catch( (error)=> {
                  this.setState({spinner: false});
              })

      },1500);

  }

    onValueChangeCity(value) {
        this.setState({
          city_id: value
        });
    }

    validate = () => {
        let isError = false;
        let msg = '';

        if(this.state.name.length <= 0) {
            isError = true;
            msg = I18n.t('nameValidation');
        }else if (this.state.phone.length <= 0 ) {
            isError = true;
            msg = I18n.t('phoneValidation');
        }else if (this.state.email.length <= 0){
            isError = true;
            msg = I18n.t('enemail');
        }else if (this.state.email.indexOf("@") === -1 || this.state.email.indexOf(".") === -1){
            isError = true;
            msg = I18n.t('emailNotCorrect');
        }else if (this.state.country_id === null){
            isError     = true;
            msg = I18n.t('chocountry');
        }else if (this.state.city_id === null){
            isError     = true;
            msg = I18n.t('chooCity');
        }else if (this.state.password.length <= 0) {
            isError = true;
            msg = I18n.t('passwordRequired');
        }else if (this.state.password !== this.state.confirmPassword){
            isError     = true;
            msg         = I18n.t('verifyPassword');
        }
        if (msg !== ''){
            Toast.show({
                text: msg,
                duration : 2000,
                type :"danger",
                textStyle: {
                    color: "white",
                    fontFamily : 'CairoRegular' ,
                    textAlign:'center'
                }
            });

        }
        return isError;
    };

    sendData() {
        const err = this.validate();
        if (!err) {
            this.setState({isLoaded: true,spinner: true});
            axios.post(`${CONST.url}signUp`, {
                lang: this.props.lang ,
                phone : this.state.phone ,
                email : this.state.email ,
                files :  this.state.files,
                name : this.state.name ,
                password : this.state.password ,
                key : this.state.key,
                country_id: this.state.country_id ,
                city_id : this.state.city_id
            })
                .then( (response)=> {
                    this.setAsyncStorage(response);
                }).catch( (error)=> {
                    this.setState({spinner: false,isLoaded: false});
                }).then(()=>{
                this.setState({spinner: false,isLoaded: false});

            }).then(()=>{
                this.setState({spinner: false, isLoaded: false});
            });
        }
    }

    async setAsyncStorage(response) {

        if(response.data.value === '1') {
          Toast.show({ text: response.data.msg, duration : 2000  ,type :'success',textStyle: { color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });
           this.props.navigation.navigate('Confirmation',
                 {
                     phone: this.state.phone,
                     key : this.state.key,
                     password: this.state.password,
                     user_id :response.data.user_id,
                     code    : response.data.code
              });
      }else if(response.data.value === '2') {
           Alert.alert(
               `${I18n.currentLocale() === 'en' ? 'Sign In' : 'سجل دخول'}`,
               `${I18n.currentLocale() === 'en' ? 'User exists , Login Now ?' : 'هذا الحساب مسجل بالفعل ، تسجيل دخول ؟'}`,
               [
                   {
                       text: `${I18n.currentLocale() === 'en' ? 'Sign In' : 'سجل دخول'}`,
                       onPress: () => this.props.navigation.navigate('login')
                   },
                   {
                       text: `${I18n.currentLocale() === 'en' ? 'Cancel' : 'إلغاء'}`,
                       onPress: () => console.log('Cancel Pressed'),
                       style: 'cancel',
                   }
               ],
               {cancelable: false},
           );
       }else{
            Toast.show({ text: response.data.msg, duration : 2000  ,textStyle: { color: "yellow",fontFamily            : 'CairoRegular' ,textAlign:'center' } });
        }
    }

    renderSubmit() {
        if (this.state.isLoaded){
            return(
                <View  style={{ justifyContent:'center', alignItems:'center'}}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }
        return (

            <Button  onPress={() => this.sendData()} style={styles.bgLiner}>
                <Text style={styles.textBtn}>{I18n.translate('send')}</Text>
            </Button>

        );
    }

    render() {

    let { image } = this.state;

    return (
      <Container style={[ styles.bg_darkGreen ]}>

          <Spinner visible={this.state.spinner}/>

          <Header style={[styles.Header_Up]}>
              <Body style={[styles.body_header,styles.textHead]}>
                  <Title style={styles.headerTitle}>{I18n.translate('signUP')}</Title>
              </Body>
              <Right style={[ styles.RightDir ]}>
                  <Button transparent onPress={()=> this.props.navigation.goBack()} >
                      <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                  </Button>
              </Right>
          </Header>

        <Content contentContainerStyle={[ styles.bgFullWidth ]}>
            <View style={styles.imagePicker}>
              <Button onPress={this._pickImage} style={styles.clickOpen}>
                <Icon style={styles.iconImage} active type="FontAwesome" name='image' />
              </Button>
              {image && <Image source={{ uri: image }} style={styles.imgePrive} />}
            </View>

            <View style={styles.bgDiv}>

            <KeyboardAvoidingView behavior="padding" style={{ flex: 1, width :'100%'}} >
             <View style={{width :'100%'}}>

                 <View style={[styles.overHidden, styles.Width_100]}>
                     <View style={[ styles.item, { borderColor : (this.state.nameStatus === 1 ? '#00374B' : '#DDD') } ]} >
                         <Input
                             placeholder={ I18n.translate('username')}
                             placeholderTextColor='#00374B'
                             onChangeText={(name) => this.setState({name})}
                             style={[styles.input, styles.height_50]}
                             onBlur={() => this.unActiveInput('name')}
                             onFocus={() => this.activeInput('name')}
                         />
                     </View>
                 </View>

                 <View style={[styles.overHidden, styles.Width_100]}>
                     <View style={[ styles.item, { borderColor : (this.state.phoneStatus === 1 ? '#00374B' : '#DDD') } ]} >
                         <Input
                             placeholder={ I18n.translate('phone')}
                             placeholderTextColor='#00374B'
                             onChangeText={(phone) => this.setState({phone})}
                             style={[styles.input, styles.height_50]}
                             onBlur={() => this.unActiveInput('phone')}
                             onFocus={() => this.activeInput('phone')}
                             keyboardType={'number-pad'}
                         />
                     </View>
                 </View>

                 <View style={[styles.overHidden, styles.Width_100]}>
                     <View style={[ styles.item, { borderColor : (this.state.emailStatus === 1 ? '#00374B' : '#DDD') } ]} >
                         <Input
                             placeholder={ I18n.translate('email')}
                             placeholderTextColor='#00374B'
                             onChangeText={(email) => this.setState({email})}
                             style={[styles.input, styles.height_50]}
                             onBlur={() => this.unActiveInput('email')}
                             onFocus={() => this.activeInput('email')}
                         />
                     </View>
                 </View>

                 <View style={[ styles.rowGroups, styles.Border, styles.marginVertical_5, (this.state.country_id !== null ? styles.borderOldGray : styles.borderWhite)]}>
                     <Picker
                         iosHeader={I18n.translate('choose_country')}
                         headerBackButtonText={I18n.translate('goBack')}
                         mode="dropdown"
                         placeholder={I18n.translate('choose_country')}
                         placeholderStyle={{ color: "#00374B", writingDirection: 'rtl',fontFamily : 'CairoRegular' }}
                         placeholderIconColor="#444"
                         style={{backgroundColor:'transparent',color: '#00374B', writingDirection: 'rtl',fontFamily : 'CairoRegular'}}
                         selectedValue={this.state.country_id}
                         itemTextStyle={{ color: '#00374B', writingDirection: 'rtl',fontFamily : 'CairoRegular' }}
                         textStyle={{ color: "#00374B" , writingDirection: 'rtl',fontFamily : 'CairoRegular',paddingLeft : 5, paddingRight: 5 }}
                         onValueChange={this.onValueChange.bind(this)}>
                         {this.state.countries.map((city, i) => {
                             return <Picker.Item style={{color: "#00374B", width : '100%',fontFamily : 'CairoRegular'}}  key={i} value={city.id} label={city.name} />
                         })}
                     </Picker>
                     <Icon style={[ styles.textSize_14, styles.text_White, styles.paddingHorizontal_10 ]} name='down' type="AntDesign"/>
                 </View>

                 <View style={[ styles.rowGroups, styles.Border, styles.marginVertical_5, (this.state.city_id !== null ? styles.borderOldGray : styles.borderWhite)]}>
                     <Picker
                         mode="dropdown"
                         iosHeader={I18n.translate('myCity')}
                         headerBackButtonText={I18n.translate('goBack')}
                         style={{backgroundColor:'transparent',color: '#00374B', writingDirection: 'rtl',fontFamily : 'CairoRegular'}}
                         placeholderStyle={{ color: "#00374B", writingDirection: 'rtl',fontFamily : 'CairoRegular' }}
                         selectedValue={this.state.city_id}
                         onValueChange={this.onValueChangeCity.bind(this)}
                         textStyle={{ color: "#00374B", writingDirection: 'rtl',fontFamily : 'CairoRegular',paddingLeft : 5, paddingRight: 5 }}
                         placeholder={I18n.translate('myCity')}
                         itemTextStyle={{ color: '#00374B', writingDirection: 'rtl',fontFamily : 'CairoRegular' }}>
                         {this.state.cities.map((city, i) => {
                             return <Picker.Item   style={{color: "#00374B" ,fontFamily : 'CairoRegular'}}  key={i} value={city.id} label={city.name} />
                         })}
                     </Picker>
                     <Icon style={[ styles.textSize_14, styles.text_White, styles.paddingHorizontal_10 ]} name='down' type="AntDesign"/>
                 </View>

                 <View style={[styles.overHidden, styles.Width_100]}>
                     <View style={[ styles.item, { borderColor : (this.state.passwordStatus === 1 ? '#00374B' : '#DDD') } ]} >
                         <Input
                             placeholder={ I18n.translate('password')}
                             placeholderTextColor='#00374B'
                             onChangeText={(password) => this.setState({password})}
                             style={[styles.input, styles.height_50]}
                             onBlur={() => this.unActiveInput('password')}
                             onFocus={() => this.activeInput('password')}
                             secureTextEntry
                         />
                     </View>
                 </View>

                 <View style={[styles.overHidden, styles.Width_100]}>
                     <View style={[ styles.item, { borderColor : (this.state.confirmStatus === 1 ? '#00374B' : '#DDD') } ]} >
                         <Input
                             placeholder={ I18n.translate('conpassword')}
                             placeholderTextColor='#00374B'
                             onChangeText={(confirmPassword) => this.setState({confirmPassword})}
                             style={[styles.input, styles.height_50]}
                             onBlur={() => this.unActiveInput('confirmPassword')}
                             onFocus={() => this.activeInput('confirmPassword')}
                             secureTextEntry
                         />
                     </View>
                 </View>


                 { this.renderSubmit() }

                 <TouchableOpacity onPress={() => this.props.navigation.navigate('login')} style={[ styles.rowCenter, { marginTop : 20 } ]}>
                     <Text style={[ styles.text_White, styles.textBold, styles.textSize_16 ]}>
                         {I18n.translate('have_account')}
                     </Text>
                     <Text style={[ styles.text_yellow2, styles.textBold, styles.textSize_16, styles.marginHorizontal_5]}>
                         {I18n.translate('signIn')}
                     </Text>
                 </TouchableOpacity>

             </View>
             </KeyboardAvoidingView>
            </View>
        </Content>
      </Container>
    );
  }
}


const mapStateToProps = ({ lang}) => {

    return {

        lang   : lang.lang,

    };
};
export default connect(mapStateToProps,{})(Register);




