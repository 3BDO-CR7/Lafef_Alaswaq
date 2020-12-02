import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    I18nManager,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    AsyncStorage,
    ScrollView, ActivityIndicator
} from 'react-native';
import {
    Container,
    Content,
    Form,
    Item,
    Input,
    Label,
    Icon,
    Toast,
    Title,
    Button,
    Picker,
    Header,
    Left, Body, Right
} from 'native-base'
import {connect}         from "react-redux";
import { userLogin,profile,tempAuth,logout} from "../actions";
import I18n from "ex-react-native-i18n";
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Spinner      from "react-native-loading-spinner-overlay";
import axios        from 'axios';
import {Bubbles}    from "react-native-loader";
import {NavigationEvents} from "react-navigation";
const  base_url     = 'http://plus.4hoste.com/api/';
import CONST from '../consts';
import * as Animatable from "react-native-animatable";
import styles from '../../assets/style'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lang                : 'ar',
            phone               : '',
            email               : '',
            password            : '',
            device_id           : null,
            key                 : null,
            codes               : [],
            isLoaded            : false,
            phoneStatus         : 0,
            passwordStatus      : 0,
        };

        this.setState({spinner: true});
        this.setState({lang: this.props.lang});

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

    }

    activeInput(type) {

        if (type === 'phone' || this.state.phone !== '') {
            this.setState({phoneStatus: 1})
        }

        if (type === 'password' || this.state.password !== '') {
            this.setState({passwordStatus: 1})
        }

    }

    unActiveInput(type) {

        if (type === 'phone' && this.state.phone === '') {
            this.setState({phoneStatus: 0})
        }

        if (type === 'password' && this.state.password === '') {
            this.setState({passwordStatus: 0})
        }

    }

    validate = () => {
        let isError = false;
        let msg = '';

        if (this.state.phone.length <= 0 ) {
            isError = true;
            msg = I18n.t('phoneRequired');
        }else if (this.state.password.length <= 0) {
            isError = true;
            msg = I18n.t('passwordRequired');
        }
        if (msg !== ''){
            Toast.show({
                text        : msg,
                duration    : 2000  ,
                type        : "danger",
                textStyle   : {
                    color       : "white",
                    fontFamily  : 'CairoRegular' ,
                    textAlign   : 'center'
                }
            });

        }
        return isError;
    };


    onValueChange(value) {
        this.setState({key : value});
    }

    async componentWillMount() {
         setTimeout(()=> {
             this.allowNotification();
         },8000)
    }

    async  allowNotification(){
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

    renderSubmit() {
        if (this.state.isLoaded){
            return(
                <View  style={{ justifyContent:'center', alignItems:'center'}}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }
        return (

            <Button  onPress={() => this.onLoginPressed()} style={styles.bgLiner}>
                <Text style={styles.textBtn}>{I18n.translate('signIn')}</Text>
            </Button>

        );
    }

    componentWillReceiveProps(newProps){
        if( newProps.result === 2 &&  newProps.auth !== null)
        {

            this.props.navigation.navigate('Confirmation_Page',{
                user_id : newProps.userId,
                code    : newProps.auth.code
            })

        }else{


            if (newProps.auth !== null && newProps.auth.value === '1'){

                this.setState({ user_id: newProps.auth.data.id });
                this.props.profile({user_id :newProps.auth.data.id , lang : this.props.lang});
                AsyncStorage.setItem('plusUserData', JSON.stringify(newProps.auth.data));
                this.props.navigation.navigate('home');

            }else if(newProps.auth !== null && newProps.auth.value === '2')
            {


                this.props.navigation.navigate('Confirmation',
                    {
                        phone: this.state.phone,
                        email: this.state.email,
                        key : this.state.key,
                        password: this.state.password,
                        user_id :this.props.userId,
                        code    : newProps.auth.code,
                        type : 'login'
                    });
            }else{
            }

            if (newProps.auth !== null) {

                if(newProps.auth.value === '0'){
                    this.props.logout({ token: null });
                    this.props.tempAuth();
                }

                Toast.show({
                    text: newProps.auth.msg,
                    duration : 2000  ,
                    type : (newProps.auth.value === '1'  || newProps.auth.value === '2' )? "success" : "danger",
                    textStyle: {  color: "white",
                        fontFamily : 'CairoRegular' ,
                        textAlign:'center'
                    }
                });

            }

        }
        this.setState({ isLoaded: false });
    }

    onLoginPressed() {
        const err = this.validate();
        if (!err){
            this.setState({ isLoaded: true });
            const {phone, password, device_id , key,lang} = this.state;
            this.props.userLogin({ phone, password, device_id, key ,lang } );
        }
    }

    onFocus() {
        this.componentWillMount()
    }

    render() {
        return <Container>

            {/*<Header style={styles.Header_Up}>*/}
            {/*    <Body style={[styles.body_header,styles.flex]}>*/}
            {/*    <Title style={styles.headerTitle}>{I18n.translate('signIn')}</Title>*/}
            {/*    </Body>*/}
            {/*    <Right style={[ styles.RightDir ,styles.flex]}>*/}
            {/*        <Button transparent onPress={()=> this.props.navigation.goBack()} >*/}
            {/*            <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />*/}
            {/*        </Button>*/}
            {/*    </Right>*/}
            {/*</Header>*/}

            <Spinner visible={this.state.spinner}/>

            <NavigationEvents onWillFocus={() => this.onFocus()} />

            <ScrollView contentContainerStyle={{flexGrow: 1}}>


                <View style={[styles.bgImage, styles.bg_darkGreen]}>

                    <View style={[styles.overHidden,{width : '100%'}]}>
                        <Animatable.View animation="fadeInUp" easing="ease-out" delay={500}>
                            <Image style={[styles.logo]} source={require('../../assets/lang.png')}/>
                        </Animatable.View>
                    </View>

                    <View style={styles.bgDiv}>
                        <KeyboardAvoidingView behavior="padding" style={{  flex: 1 , width : '100%'}} >
                            <Form style={{width : '100%'}}>

                                <View style={{width : '100%', flexDirection: 'row',marginVertical: 10, borderWidth : 1 ,borderColor : (this.state.phoneStatus === 1 ? '#00374B' : '#DDD')}}>
                                    <View style={[ styles.overHidden, { flex : 2 } ]}>
                                        <Input
                                            placeholder={ I18n.translate('phone')}
                                            placeholderTextColor='#00374B'
                                            onChangeText={(phone) => this.setState({phone})}
                                            style={[styles.input, styles.height_50]}
                                            onBlur={() => this.unActiveInput('phone')}
                                            onFocus={() => this.activeInput('phone')}
                                        />
                                    </View>

                                    <View style={{flex:1, borderLeftWidth : 1, borderLeftColor : (this.state.mobileStatus === 1 ? '#00374B' : '#DDD')}}>
                                        <Item style={[ styles.itemPiker, { borderWidth : 0 } ]} regular>
                                            <Picker
                                                headerBackButtonText={I18n.translate('goBack')}
                                                mode="dropdown"
                                                style={[styles.Picker, { borderWidth : 0 }]}
                                                selectedValue={this.state.key}
                                                onValueChange={this.onValueChange.bind(this)}
                                                placeholderStyle={{ color: "#00374B", writingDirection: 'rtl', width : '100%',fontFamily : 'CairoRegular', fontSize : 12 }}
                                                textStyle={{ color: "#00374B",fontFamily : 'CairoRegular', writingDirection: 'rtl',paddingLeft : 5, paddingRight: 5 }}
                                                itemTextStyle={{ color: '#00374B',fontFamily : 'CairoRegular', writingDirection: 'rtl' }}>
                                                {
                                                    this.state.codes.map((code, i) => {
                                                        return <Picker.Item   style={{color: "#00374B",marginHorizontal: 20}}  key={i} value={code} label={code} />
                                                    })
                                                }
                                            </Picker>
                                            <Icon style={[ styles.iconPicker ,{ top : 17 } ]} type="AntDesign" name='down' />
                                        </Item>
                                    </View>
                                </View>

                                <View style={[styles.overHidden, styles.Width_100]}>
                                    <View style={[ styles.item ,{ borderColor : (this.state.passwordStatus === 1 ? '#00374B' : '#DDD') } ]} >
                                        {/*<Icon style={[ styles.icon_input, {top : 16} ]} active type="SimpleLineIcons" name='lock'/>*/}
                                        {/*<Label style={styles.label}>{I18n.translate('password')}</Label>*/}
                                        <Input
                                            autoCapitalize='none'
                                            value={ this.state.password }
                                            placeholder={ I18n.translate('password')}
                                            onChangeText={(password) => this.setState({password})}
                                            onBlur={() => this.unActiveInput('password')}
                                            onFocus={() => this.activeInput('password')}
                                            secureTextEntry
                                            placeholderTextColor='#00374B'
                                            style={[styles.input, styles.height_50]}
                                        />
                                    </View>
                                </View>

                                <TouchableOpacity onPress={() => this.props.navigation.navigate('forgetpassword')}>
                                    <Text style={[styles.textSize_14, styles.textBold, styles.text_White, styles.flexCenter , styles.marginVertical_25]}>{I18n.translate('forgetPass')}</Text>
                                </TouchableOpacity>

                                { this.renderSubmit() }

                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('register')}
                                    style={[ { marginBottom : 30, marginTop : 10 }, styles.rowCenter ]}
                                >
                                    <Text style={[styles.textBold, styles.text_White, styles.textSize_14]}>
                                        {I18n.translate('have_account')}
                                    </Text>
                                    <Text style={[styles.textBold, styles.text_yellow2, styles.textSize_14, styles.textDecoration, styles.marginHorizontal_5]}>
                                        {I18n.translate('signUP')}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('home')}
                                    style={[ styles.bgLiner, styles.height_45 ]}
                                >
                                    <Text style={[styles.textBtn]}>
                                        {I18n.translate('visitorRegister')}
                                    </Text>
                                </TouchableOpacity>


                            </Form>
                        </KeyboardAvoidingView>
                    </View>
                </View>
            </ScrollView>
        </Container>;
    }
}


const mapStateToProps = ({ auth,profile, lang  }) => {

    return {

        auth     : auth.user,
        lang     : lang.lang,
        result   : auth.success,
        userId   : auth.user_id,
    };
};
export default connect(mapStateToProps, {logout, tempAuth,userLogin ,profile})(Login);
