import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    I18nManager,
    ActivityIndicator,
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
    Right,
    Header
} from 'native-base'

import I18n from "ex-react-native-i18n";
import axios from "axios";
import Spinner from "react-native-loading-spinner-overlay";
// const  base_url = 'http://plus.4hoste.com/api/';
import { connect } from 'react-redux';
import { userLogin,logout,tempAuth } from '../actions'
import {Bubbles} from "react-native-loader";
import CONST from '../consts';
import * as Animatable from "react-native-animatable";
import styles from '../../assets/style'

class ConfirmationPage extends Component {


    constructor(props) {

        super(props);
        I18nManager.forceRTL(true);

        this.state  = {
            user_id      : null,
            isLoaded     : false,
            en_message   : 'please complete all required data',
            ar_message   : 'برجآء تأكد من إدخال جميع البيانات',
            code         : null,
            lang         : 'ar',
            keyValue     : '',
            typePage     : '',
            codeStatus : 0
        };

        this.props.logout({ token: this.props.navigation.state.params.user_id });
        this.props.tempAuth();
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

    componentWillMount() {

        this.setState({user_id: this.props.navigation.state.params.user_id});

        console.log('user_id', this.props.navigation.state.params.user_id )
        console.log('type', this.props.navigation.state.params.type )

    }

    validate = () => {
        let isError = false;
        let msg = '';

        if (this.state.code  == null|| this.state.code ===  '') {
            isError = true;
            msg = I18n.t('codeValidation');
        }
        if (msg != ''){
            Toast.show({ text: msg, duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });

        }
        return isError;
    };



    sendData()
    {

        this.setState({lang : this.props.lang});

        if(this.state.code == null )
        {
            Toast.show({ text: ( this.props.lang === 'en' ? this.state.en_message : this.state.ar_message), duration : 2000 ,textStyle: { color: "yellow",fontFamily            : 'CairoRegular' ,textAlign:'center' }});
        }else{

            this.setState({spinner: true});

            if(this.props.navigation.state.params.type === 'phone'){

                    axios.post(`${CONST.url}activateAccount`, {
                        lang: this.props.lang ,
                        code : this.state.code ,
                        user_id : this.props.navigation.state.params.user_id
                    })
                    .then( (response)=> {
                        this.setAsyncStorage(response);
                    })
                    .catch( (error)=> {
                        this.setState({spinner: false});
                    }).then(()=>{
                        this.setState({spinner: false});
                    })


            }else if (this.props.navigation.state.params.type === 'email') {

                    axios.post(`${CONST.url}activateNewEmail`, {
                        lang: this.props.lang ,
                        code : this.state.code ,
                        user_id : this.props.navigation.state.params.user_id
                    })
                    .then( (response)=> {
                        this.setAsyncStorage(response);
                    })
                    .catch( (error)=> {
                        this.setState({spinner: false});
                    }).then(()=>{
                        this.setState({spinner: false});
                    })

            }else{

                axios.post(`${CONST.url}activateForLogin`, {
                    lang: this.props.lang ,
                    code : this.state.code ,
                    user_id : this.props.navigation.state.params.user_id
                })
                    .then( (response)=> {
                        this.setAsyncStorage(response);
                    })
                    .catch( (error)=> {
                        this.setState({spinner: false});
                    }).then(()=>{
                    this.setState({spinner: false});
                })

            }

        }
    }

    async setAsyncStorage(response) {

        if(response.data.value === '1')
        {
            this.setState({isLoaded: false});
            this.setState({spinner: false});
            Toast.show({ text: response.data.msg, duration : 2000 ,type : 'success' ,textStyle: { color: "white",fontFamily            : 'CairoRegular' ,textAlign:'center' } });
            this.props.navigation.navigate('login');

        }else{
            Toast.show({ text: response.data.msg, duration : 2000 ,type : 'danger' ,textStyle: { color: "white",fontFamily            : 'CairoRegular' ,textAlign:'center' } });
            this.setState({spinner: false});
        }
    }


    renderSubmit()
    {

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


    componentWillReceiveProps(newProps){

        if(newProps.logout == 1)
        {
            console.log('my new props' , newProps)
            this.props.navigation.navigate('home');
        }

    }

    render() {
        return (
            <Container style={[ styles.bg_darkGreen ]}>

                <Spinner visible={this.state.spinner}/>

                <Header style={styles.Header_Up}>
                    <Body style={styles.body_header}>
                        <Title style={styles.headerTitle}>{I18n.translate('insert_code')}</Title>
                    </Body>
                    <Right style={[ styles.RightDir ]}>
                        <Button transparent onPress={()=> this.props.navigation.goBack()} >
                            <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                        </Button>
                    </Right>
                </Header>


                <Content contentContainerStyle={[ styles.bgFullWidth ]}>
                    <KeyboardAvoidingView behavior="padding" enabled  style={{flex:1, width : '100%'}}>


                        <View style={styles.overHidden}>
                            <Animatable.View animation="fadeInUp" easing="ease-out" delay={500}>
                                <Image style={styles.logo} source={require('../../assets/icon.png')}/>
                            </Animatable.View>
                        </View>


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
                                            keyboardType={'number-pad'}
                                        />
                                    </View>
                                </View>


                                { this.renderSubmit() }

                            </Form>
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

export default connect(mapStateToProps, { userLogin,logout,tempAuth })(ConfirmationPage);


