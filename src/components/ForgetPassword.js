import React, { Component } from 'react';
import { Text, View, Image, ScrollView, ActivityIndicator} from 'react-native';
import {
    Container,
    Form,
    Item,
    Input,
    Icon,
    Title,
    Button,
    Header,
    Body,
     Right,
    Toast, Picker
} from 'native-base'

import I18n from "ex-react-native-i18n";
import axios from "axios";
import Spinner from "react-native-loading-spinner-overlay";
import {connect} from "react-redux";
import {profile} from "../actions";
import CONST from '../consts';
import * as Animatable from "react-native-animatable";
import styles from '../../assets/style'

class ForgetPassword extends Component {


    constructor(props) {
        super(props);
        this.state = {
            lang       : 'ar',
            key       : '',
            phone     : '',
            isLoaded  : false,
            codes     : [],
            phoneStatus         : 0,
        };
    }
    activeInput(type) {

        if (type === 'phone' || this.state.phone !== '') {
            this.setState({phoneStatus: 1})
        }

    }

    unActiveInput(type) {

        if (type === 'phone' && this.state.phone === '') {
            this.setState({phoneStatus: 0})
        }

    }


    componentWillMount() {

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


    onValueChange(value) {
        this.setState({key : value});
    }

    onLoginPressed()
    {
        const err = this.validate();
        if (!err){
            this.setState({spinner: true,isLoaded: true});
            axios.post(`${CONST.url}forgetPassword`, { lang: this.props.lang , phone : this.state.phone, key : this.state.key })
                .then( (response)=> {
                    this.setAsyncStorage(response);
                }).catch( (error)=> {
                    this.setState({spinner: false,isLoaded: false});

            }).then(()=>{
                this.setState({spinner: false,isLoaded: false});

            });
            }
    }

    async setAsyncStorage(response){
        if(response.data.value === '1')
        {
            Toast.show({ text: response.data.msg, duration : 2000 , type :"success",textStyle: { color: "white",fontFamily            : 'CairoRegular' ,textAlign:'center' } });
            this.props.navigation.navigate('newpassword',{
                user_id  : response.data.user_id,
                key      : response.data.key,
                mobile   : response.data.mobile,
            });

        }else{
            Toast.show({
                text: response.data.msg,
                duration : 2000 ,
                type :"danger",
                textStyle: {
                    color: "white",
                    fontFamily : 'CairoRegular' ,
                    textAlign:'center'
                }
            });
        }
    }

    validate = () => {
        let isError = false;
        let msg = '';

        if (this.state.phone.length <= 0) {
            isError = true;
            msg = I18n.t('phoneValidation');
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
                <View  style={{ justifyContent:'center', alignItems:'center', marginTop:70}}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }

        return (

            <Button  onPress={() => this.onLoginPressed()} style={styles.bgLiner}>
                <Text style={styles.textBtn}>{I18n.translate('send')}</Text>
            </Button>

        );
    }

  render() {
    return (
      <Container>

          <Header style={styles.Header_Up}>
              <Body style={[styles.body_header,styles.textHead]}>
                  <Title style={styles.headerTitle}>{I18n.translate('forgetPass')}</Title>
              </Body>
              <Right style={[ styles.RightDir ]}>
                  <Button transparent onPress={()=> this.props.navigation.goBack()} >
                      <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                  </Button>
              </Right>
          </Header>

        <Spinner visible={this.state.spinner}/>
        <ScrollView contentContainerStyle={[ styles.bg_darkGreen, styles.bgFullWidth ]}>
             <Form style={[ styles.Width_100, styles.flexCenter, { marginTop:  60} ]}>
                 <View style={[styles.overHidden,{width : '100%'}]}>
                     <View style={{width : '90%', flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>

                     <Animatable.View animation="fadeInUp" easing="ease-out" delay={500}>
                         <Image style={[styles.logo]} source={require('../../assets/lang.png')}/>
                     </Animatable.View>
                     </View>
                 </View>
                 <View style={{width : '90%', flexDirection: 'row',marginVertical: 10, borderWidth : 1 ,borderColor : (this.state.phoneStatus === 1 ? '#00374B' : '#DDD')}}>
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
                 <View style={{width : '90%', flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
                 { this.renderSubmit() }
                 </View>
             </Form>
        </ScrollView>
      </Container>
    );
  }
}

const mapStateToProps = ({ auth, lang ,profile }) => {

    return {
        auth   : auth.user,
        lang   : lang.lang,
        user   : profile.user
    };
};
export default connect(mapStateToProps, {profile})(ForgetPassword);



