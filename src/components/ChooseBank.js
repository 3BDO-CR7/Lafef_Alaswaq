import React, { Component } from 'react';
import {Container, Content, Button, Icon, Title, Header, Body, Right, Left, CheckBox, Toast} from 'native-base';
import I18n from "ex-react-native-i18n";
import Spinner from "react-native-loading-spinner-overlay";
import axios from "axios";
import {connect} from "react-redux";
import {profile} from "../actions";
import CONST from '../consts';
import styles from '../../assets/style'
import {TouchableOpacity, Text, View, Image, Dimensions, I18nManager} from "react-native";
import HTML from "react-native-render-html";
class ChooseBank extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bank                : null ,
            selectedId          : null,
            checked             : null,
            spinner             : false,
            text                : '' ,
            lang                : 'ar',
            banks               : [],
            bankImg             : '',
            bankName            : '',
            bankNumber          : ''
        };
        this.setState({spinner: true});
    }

    componentWillMount() {
        this.setState({spinner: true});
        axios.post(`${CONST.url}commission_info`, { lang: this.props.lang  })
            .then( (response)=> {
                this.setState({
                    site_commission: response.data.data.site_commission,
                    text: response.data.data.site_commission_notes
                });
                axios.post(`${CONST.url}banks`, { lang: this.props.lang })
                    .then( (response)=> {
                        this.setState({banks: response.data.data});
                    }).then(()=>{
                    this.setState({spinner: false});
                });
            })
    }

    selectBankId(id,name,number,image) {
        this.setState({
            checked  : id,
        });
        this.state.selectedId       = id;
        this.state.bankImg          = image;
        this.state.bankNumber       = number;
        this.state.bankName         = name;
    }

    moveBank(){

        if(this.state.selectedId === null)
        {
            Toast.show({
                text        : I18n.translate('choose_bank'),
                duration    : 2000 ,
                type        : "danger",
                textStyle   : {
                    color       : "white",
                    fontFamily  : 'CairoRegular',
                    textAlign   : 'center'
                }
            });
        }else{
            this.props.navigation.navigate('commission',{
                id                  : this.state.selectedId,
                bankName            : this.state.bankName,
                bankImg             : this.state.bankImg,
                bankNumber          : this.state.bankNumber,
            })
        }

    }

    render() {
        return (
            <Container>
                <Header style={[styles.Header_Up]}>
                    <Body style={[styles.body_header,styles.textHead]}>
                    <Title style={styles.headerTitle}>{I18n.translate('choose_bank')}</Title>
                    </Body>
                    <Right style={[ styles.RightDir ]}>
                        <Button transparent onPress={()=> this.props.navigation.goBack()} >
                            <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                        </Button>
                    </Right>
                </Header>
                <Spinner visible={this.state.spinner}/>
                <Content>

                    <View style={[{width: '90%', paddingHorizontal : 10}]}>
                        <HTML
                            html                  = {this.state.site_commission}
                            imagesMaxWidth        = {Dimensions.get('window').width}
                            baseFontStyle         = {{
                                fontSize            : 15,
                                fontFamily          : 'CairoRegular',
                                color               : CONST.dark,
                                textAlgin           : 'center',
                                alignItems          : 'center',
                                justifyContent      : 'center',
                                alignSelf           : 'center',
                                writingDirection    : I18nManager.isRTL ? 'rtl' : 'ltr'
                            }}
                        />
                    </View>

                    <View style={[{width: '90%', paddingHorizontal : 10}]}>
                        <HTML
                            html                  = {this.state.text}
                            imagesMaxWidth        = {Dimensions.get('window').width}
                            baseFontStyle         = {{
                                fontSize            : 15,
                                fontFamily          : 'CairoRegular',
                                color               : CONST.dark,
                                textAlgin           : 'center',
                                alignItems          : 'center',
                                justifyContent      : 'center',
                                alignSelf           : 'center',
                                writingDirection    : I18nManager.isRTL ? 'rtl' : 'ltr'
                            }}
                        />
                    </View>


                    <View style={[ styles.Width_90, styles.flexCenter ]}>
                        {this.state.banks.map((bank, i) => {
                            return (
                                <TouchableOpacity
                                    onPress             = {() => this.selectBankId(bank.id,bank.name,bank.account_number,bank.image)}
                                    style               = {[ styles.marginVertical_5, styles.paddingHorizontal_5, styles.paddingVertical_5, styles.Width_100, styles.SelfCenter, styles.position_R]}>
                                    <TouchableOpacity
                                        style               = {[styles.position_A , { top : 10, right : 25 , zIndex : 999 }]}
                                        onPress             = {() => this.selectBankId(bank.id,bank.name,bank.account_number,bank.image)}
                                    >
                                        <CheckBox
                                            style               = {[styles.checkBox ,{ backgroundColor : '#00374B', borderColor : '#00374B', borderWidth : 1, }]}
                                            color               = {styles.text_White}
                                            selectedColor       = {styles.text_White}
                                            checked             = {this.state.checked === bank.id}
                                            onPress             = {() => this.selectBankId(bank.id,bank.name,bank.account_number,bank.image)}
                                        />
                                    </TouchableOpacity>
                                    <View style={[ styles.Border, styles.border_gray, styles.bg_White, styles.paddingHorizontal_10, styles.paddingVertical_5 ,styles.rowFlex, styles.Width_100, styles.position_R, { zIndex : -1 } ]}>
                                        <View style={[ styles.Bank, styles.Radius_5, styles.Border, styles.opcity_gray, styles.Radius_5, styles.bg_White ]}>
                                            <Image style={[styles.Bank]} source={{ uri: bank.image }} resizeMode={'contain'}/>
                                        </View>
                                        <View style={[ styles.overHidden, styles.marginHorizontal_10 ]}>
                                            <View style={[ styles.rowFlex ]}>
                                                <Text style={[styles.textRegular, styles.textSize_14, styles.text_gray]}>{ I18n.translate('accountName')}</Text>
                                                <Text style={[styles.textRegular, styles.textSize_14, styles.marginHorizontal_5]}>:</Text>
                                                <Text style={[styles.textRegular, styles.textSize_14,]}>{ bank.name }</Text>
                                            </View>
                                            <View style={[ styles.rowFlex ]}>
                                                <Text style={[styles.textRegular, styles.textSize_14,]}>{ I18n.translate('account_number')}</Text>
                                                <Text style={[styles.textRegular, styles.textSize_14, styles.marginHorizontal_5]}>:</Text>
                                                <Text style={[styles.textRegular, styles.textSize_14]}>{ bank.account_number }</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}

                    </View>
                    <TouchableOpacity style={styles.clickMore} onPress={() => this.moveBank()}>
                        <Text style={styles.textMore}> {I18n.translate('send')}</Text>
                    </TouchableOpacity>
                </Content>
            </Container>
        );
    }

}

const mapStateToProps = ({ auth, lang ,profile}) => {

    return {

        auth   : auth.user,
        lang   : lang.lang,
        user   : profile.user,
    };
};
export default connect(mapStateToProps,{profile})(ChooseBank);



