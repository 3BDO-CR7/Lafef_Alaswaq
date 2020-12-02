import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    I18nManager,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    AsyncStorage,
    ActivityIndicator
} from 'react-native';
import {
    Container,
    Content,
    Form,
    Item,
    Input,
    Label,
    Title,
    Button,
    Icon,
    Header,

    Left,
    Body,
    Right,
    Toast
} from 'native-base'

import { LinearGradient } from 'expo';
import I18n from "ex-react-native-i18n";
import {Bubbles} from "react-native-loader";
import axios from "axios";
import {connect} from "react-redux";
import {profile, userLogin} from "../actions";
const  base_url = 'http://plus.4hoste.com/api/';
import CONST from '../consts';
import * as Animatable from "react-native-animatable";
import styles from '../../assets/style'

class NewPassword extends Component {


    constructor(props) {
        super(props);
        this.state = {
            lang                : 'ar',
            password            : '',
            cf_password         : '',
            user_id             : '',
            code                : '',
            device_id           : '',
            key                 : '',
            phone               : '',
            isLoaded            : false,
            spinner             : false,
            codeStatus          : 0,
            passwordStatus      : 0,
            cf_passwordStatus   : 0,
        };

    }


    activeInput(type) {

        if (type === 'code' || this.state.code !== '') {
            this.setState({codeStatus: 1})
        }

        if (type === 'password' || this.state.password !== '') {
            this.setState({passwordStatus: 1})
        }

        if (type === 'cf_password' || this.state.cf_password !== '') {
            this.setState({cf_passwordStatus: 1})
        }

    }

    unActiveInput(type) {

        if (type === 'code' && this.state.code === '') {
            this.setState({codeStatus: 0})
        }

        if (type === 'password' && this.state.password === '') {
            this.setState({passwordStatus: 0})
        }

        if (type === 'cf_password' && this.state.cf_password === '') {
            this.setState({cf_passwordStatus: 0})
        }

    }

      componentWillMount() {
            this.setState({
                user_id            : this.props.navigation.state.params.user_id,
                key                : this.props.navigation.state.params.key,
                phone              : this.props.navigation.state.params.mobile,
                lang               : this.props.lang,
            });
      }

    componentWillReceiveProps(newProps){


        if (newProps.auth !== null && newProps.auth.value === '1'){

            this.setState({ user_id: newProps.auth.data.id });
            this.props.profile({user_id :newProps.auth.data.id});
            AsyncStorage.setItem('plusUserData', JSON.stringify(newProps.auth.data));
            this.props.navigation.navigate('home');

        }

        if (newProps.auth !== null) {

            Toast.show({
                text: newProps.auth.msg,
                duration : 2000  ,
                type : (newProps.auth.value === '1'  || newProps.auth.value === '2' )? "success" : "danger",
                textStyle: {  color: "white",
                    fontFamily : 'CairoRegular' ,
                    textAlign:'center'
                } });

        }

        this.setState({spinner: false,isLoaded: false});
    }

    sendData() {
        const err = this.validate();
        if (!err) {
            this.setState({isLoaded: true,spinner: true});

            axios.post(`${CONST.url}resetPassword`, {
                lang            : this.props.lang ,
                password            : this.state.password,
                code        : this.state.code,
                user_id         : this.state.user_id,
            })
                .then( (response)=> {

                        if(response.data.value === '1')
                        {
                            this.setState({isLoaded: true,spinner: true});

                            const {phone, password, device_id , key,lang} = this.state;
                            this.props.userLogin({ phone, password, device_id, key ,lang } );
                            this.props.profile({  user_id:  this.state.user_id });

                        }

                        Toast.show({
                        text: response.data.msg,
                        duration : 2000  ,
                        type : (response.data.value === '1' )? "success" : "danger",
                        textStyle: {  color: "white",   fontFamily : 'CairoRegular' , textAlign:'center'
                        } });

                }).catch( (error)=> {
                this.setState({spinner: false,isLoaded: false});

            }).then(()=>{
                this.setState({spinner: false,isLoaded: false});

            });
         }
    }

    validate = () => {
        let isError = false;
        let msg = '';

        if (this.state.code.length <= 0 ) {
            isError = true;
            msg = I18n.t('codeValidation');
        }else if(this.state.password.length < 6)
        {   isError = true;
            msg = I18n.t('passwordRequired');

        }else if(this.state.password !== this.state.cf_password)
        {   isError = true;
            msg = I18n.t('cf_passwordRequired');
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

    renderSubmit() {

        if (this.state.isLoaded){
            return(
                <View  style={{ justifyContent:'center', alignItems:'center' , marginTop:50}}>
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
    return (
      <Container style={[ styles.bg_darkGreen ]}>

          <Header style={styles.Header_Up}>
              <Body style={[ styles.body_header , styles.textHead ]}>
                  <Title style={styles.headerTitle}>{I18n.translate('newPass')}</Title>
              </Body>
              <Right style={[ styles.RightDir ]}>
                  <Button transparent onPress={()=> this.props.navigation.goBack()} >
                      <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                  </Button>
              </Right>
          </Header>


          <ScrollView contentContainerStyle={[ styles.bgFullWidth ]}>

            <View style={styles.overHidden}>
                <Animatable.View animation="fadeInUp" easing="ease-out" delay={500}>
                    <Image style={styles.logo} source={require('../../assets/icon.png')}/>
                </Animatable.View>
            </View>


        <View style={styles.bgImage}>


            <KeyboardAvoidingView behavior="padding"    style={{  flex: 1}} >

            <View style={styles.bgDiv}>


                <Form style={[ styles.Width_100 ]}>

                    <View style={[styles.overHidden, styles.Width_100]}>
                        <View style={[ styles.item, { borderColor : (this.state.codeStatus === 1 ? '#00374B' : '#DDD') } ]} >
                            <Input
                                placeholder={ I18n.translate('code')}
                                placeholderTextColor='#00374B'
                                onChangeText={(code) => this.setState({code})}
                                style={[styles.input, styles.height_50]}
                                onBlur={() => this.unActiveInput('code')}
                                onFocus={() => this.activeInput('code')}
                            />
                        </View>
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
                        <View style={[ styles.item, { borderColor : (this.state.cf_passwordStatus === 1 ? '#00374B' : '#DDD') } ]} >
                            <Input
                                placeholder={ I18n.translate('verifyNewPass')}
                                placeholderTextColor='#00374B'
                                onChangeText={(cf_password) => this.setState({cf_password})}
                                style={[styles.input, styles.height_50]}
                                onBlur={() => this.unActiveInput('cf_password')}
                                onFocus={() => this.activeInput('cf_password')}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    { this.renderSubmit() }

                </Form>



            </View>
            </KeyboardAvoidingView>

        </View>
        </ScrollView>
      </Container>
    );
  }
}

const mapStateToProps = ({ auth,profile, lang  }) => {

    return {

        auth   : auth.user,
        lang   : lang.lang,
        result   : auth.success,
        userId   : auth.user_id,
    };
};
export default connect(mapStateToProps, { userLogin ,profile})(NewPassword);

