import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    Image,
    KeyboardAvoidingView
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
    Button,
    Toast,
    Body,
    Left,
    Right,
    Header
} from 'native-base'

import I18n from "ex-react-native-i18n";
import axios from "axios";
import Spinner from "react-native-loading-spinner-overlay";
import { connect } from 'react-redux';
import { userLogin, profile } from '../actions'
import CONST from '../consts';
import * as Animatable from "react-native-animatable";
import styles from '../../assets/style'
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import {NavigationEvents} from "react-navigation";

class Confirmation extends Component {
    constructor(props) {
        super(props);
        this.state  = {
            user_id: null,
            en_message   : 'please complete all required data',
            ar_message   : 'برجآء تأكد من إدخال جميع البيانات',
            code : null,
            lang : this.props.lang,
            device_id : null,
            codeStatus : 0
        };
    }

    activeInput(type) {

        if (type === 'code' || this.state.code !== '') {
            this.setState({codeStatus: 1})
        }

    }

    unActiveInput(type) {

        if (type === 'code' && this.state.code === '') {
            this.setState({codeStatus: 0})
        }

    }

    async componentWillMount() {


        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );

        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return;
        }

        let token = await Notifications.getExpoPushTokenAsync();

        this.setState({ device_id : token });
        AsyncStorage.setItem('deviceID', token);

    }

    sendData() {

        this.setState({lang : this.props.lang});

        if(this.state.code == null )
        {
            Toast.show({ text: ( this.props.lang === 'en' ? this.state.en_message : this.state.ar_message), duration : 2000 ,type :'danger',textStyle: { color: "white",fontFamily            : 'CairoRegular' ,textAlign:'center' }});
        }else{

           this.setState({spinner: true});

            axios.post(`${CONST.url}activateAccount`, { lang: this.props.lang , code : this.state.code , user_id :this.props.navigation.state.params.user_id  })
                .then( (response)=> {
                    this.setData(response);
                })
                .catch( ()=> {
                    this.setState({spinner: false});
                }).then(()=>{

            }).then(()=>{

            });

       }
    }

    setData(response) {

        if(response.data.value === '1')
        {
            Toast.show({
                text: response.data.msg,
                duration : 2000 ,
                type : 'success' ,
                textStyle: {
                    color: "white",
                    fontFamily : 'CairoRegular' ,
                    textAlign:'center'
                }
            });
           this.props.userLogin({
               phone : this.props.navigation.state.params.phone ,
               password : this.props.navigation.state.params.password ,
               device_id: this.state.device_id,
               key: this.props.navigation.state.params.key,
               lang:this.props.lang
           });
            this.props.profile({user_id :this.props.navigation.state.params.user_id });
            AsyncStorage.setItem('plusUserData', JSON.stringify(response.data.data));

        }else{
            Toast.show({ text: response.data.msg, duration : 2000 ,type : 'danger' ,textStyle: { color: "white",fontFamily            : 'CairoRegular' ,textAlign:'center' } });
            this.setState({spinner: false});
        }
    }

    componentWillReceiveProps(newProps){

        console.log('my new props' , newProps);
        if(newProps.auth)
        {
            this.props.navigation.navigate('home');
            this.setState({spinner: false});
        }else{
            this.setState({spinner: false});
        }

    }

    onFocus(){
        this.componentWillMount()
    }

    render() {
        return (
            <Container style={[ styles.bg_darkGreen ]}>

                <NavigationEvents onWillFocus={() => this.onFocus()}/>
                <Header style={[styles.Header_Up]}>
                    <Body style={[styles.body_header,styles.textHead]}>
                        <Title style={styles.headerTitle}>{I18n.translate('insert_code')}</Title>
                    </Body>
                    <Right style={[ styles.RightDir ]}>
                        <Button transparent onPress={()=> this.props.navigation.goBack()} >
                            <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                        </Button>
                    </Right>
                </Header>

                <Spinner visible={this.state.spinner}/>

                <Content contentContainerStyle={[ styles.bgFullWidth ]}>
                    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, width :'100%'}} >

                    <View style={[styles.flexCenter, styles.paddingHorizontal_20 , styles.Width_100 ,{marginTop : 50}]}>

                        <View style={[styles.overHidden,{width : '100%'}]}>
                            <Animatable.View animation="fadeInUp" easing="ease-out" delay={500}>
                                <Image style={[styles.logo]} source={require('../../assets/lang.png')}/>
                            </Animatable.View>
                        </View>

                        <View style={[styles.overHidden, styles.Width_100]}>
                            <View style={[ styles.item, { borderColor : (this.state.codeStatus === 1 ? '#00374B' : '#DDD') } ]} >
                                <Input
                                    placeholder={ I18n.translate('code')}
                                    placeholderTextColor='#00374B'
                                    onChangeText={(code) => this.setState({code})}
                                    style={[styles.input, styles.height_50]}
                                    onBlur={() => this.unActiveInput('code')}
                                    onFocus={() => this.activeInput('code')}
                                    keyboardType={'number-pad'}
                                />
                            </View>
                        </View>

                        <Button  onPress={() => this.sendData()} style={styles.bgLiner}>
                            <Text style={styles.textBtn}>{I18n.translate('confirm')}</Text>
                        </Button>

                    </View>
                    </KeyboardAvoidingView>
                </Content>
            </Container>
        );
    }

}

const mapStateToProps = ({ auth, lang }) => {

    return {

        auth   : auth.user,
        lang   : lang.lang
    };
};
export default connect(mapStateToProps, { userLogin ,profile })(Confirmation);


