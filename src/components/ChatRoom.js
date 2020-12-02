import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Keyboard,
    TouchableOpacity, ActivityIndicator
} from 'react-native';
import {Container, Button, Icon, Title, Textarea, Toast, Left, Body, Right, Header, Input} from 'native-base';
// import Spinner from "react-native-loading-spinner-overlay";
import axios from "axios";
import {connect} from "react-redux";
import {profile} from "../actions";
import i18n from '../../locale/i18n'
import CONST from '../consts';
import styles from '../../assets/style'

import I18n from "ex-react-native-i18n";
import {NavigationEvents} from "react-navigation";

class ChatRoom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            conversations   : [],
            name            : '',
            message         : '',
            messageErr              : '',
            lang            : this.props.lang,
            massStatus : false,
            loadChat                : false,
            loader      : false
        };
    }

    componentWillMount() {
        this.setState({loader: true});
        axios.post(`${CONST.url}inbox`, {
            lang: this.props.lang ,
            user_id : this.props.auth.data.id ,
            r_id : this.props.navigation.state.params.other , room : this.props.navigation.state.params.room
        }).then( (response)=> {
            this.setState({
                conversations     : response.data.data,
                name              : response.data.name,
                loader           : false
            });
        }).catch( (error)=> {
            this.setState({loader: false});
        })
    }

    sendMessage() {

        if (this.state.message === ''){

            this.setState({
                messageErr : i18n.t('enchat')
            });

        } else {

            this.setState({loadChat : true});

            axios.post(`${CONST.url}sendMessage`, {
                lang: this.props.lang,
                user_id: this.props.auth.data.id,
                r_id: this.props.navigation.state.params.other,
                ad_id: this.props.navigation.state.params.room,
                message: this.state.message
            }).then((response) => {

                if (response.data.value === '0') {

                    CONST.showToast(response.data.msg, 'danger');

                } else {
                    this.state.conversations.push(response.data.data);
                    this.setState({message: '', loadChat : false, messageErr : ''});
                    Keyboard.dismiss();
                }

            }).catch((error) => {
                console.warn(error);
                this.setState({message: '', loadChat : false, messageErr : ''});
                Keyboard.dismiss();
            });

        }
    }

    onFocus(){
        this.componentWillMount()
    }

    renderLoader(){
        if (this.state.loader){
            return(
                <View style={[styles.loading, styles.flexCenter]}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            );
        }
    }

    activeInput() {

        this.setState({massStatus: true})

    }

    unActiveInput() {

        this.setState({massStatus: false})

    }

    render() {
        return (
            <Container>

                <NavigationEvents onWillFocus={() => this.onFocus()}/>

                { this.renderLoader() }

                <Header style={styles.Header_Up}>
                    <Left style={[ styles.RightDir ]}>
                        <Button transparent onPress={() => {this.props.navigation.navigate('UserDetailes', {user_id: this.props.navigation.state.params.other})}}>
                            <Icon style={styles.icons} type="AntDesign" name={'infocirlceo'}/>
                        </Button>
                    </Left>
                    <Body style={[styles.body_header,styles.textHead]}>
                        <Title style={styles.headerTitle}>{this.state.name}</Title>
                    </Body>
                    <Right style={[ styles.RightDir ]}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon style={styles.icons} type="AntDesign" name={ (this.state.lang !== 'ar' || this.state.lang == null) ? 'right' : 'left' }/>
                        </Button>
                    </Right>
                </Header>

                <KeyboardAvoidingView behavior="height" style={{  flex: 1}} >
                    <ScrollView style={styles.content} ref={ref => this.scrollView = ref} onContentSizeChange={(contentWidth, contentHeight)=>{this.scrollView.scrollToEnd({animated: true});}}>
                        <View style={[ styles.Width_100, { paddingBottom : 80 } ]}>
                            {
                                this.state.conversations.map((chat, i) => {
                                    return (
                                        (this.props.auth.data.id === chat.s_id)
                                            ?
                                            <View key={i} style={{ flexDirection : 'row', justifyContent : 'space-between', margin : 10}}>
                                                <View style={[styles.width_50, styles.height_50,  { flexBasis : '15%', justifyContent : 'center',alignItems: 'center' } ]}>
                                                    <Image style={{ width : 45, height : 45, borderRadius : 25 }} source={{uri : chat.img}} resizeMode='cover'/>
                                                </View>
                                                <View style={{flexBasis : '85%'}}>
                                                    <View style={{ flexDirection : 'column',backgroundColor :'#3c95a9', borderRadius : 30, borderTopLeftRadius : 0 ,paddingVertical : 5, paddingHorizontal : 20}}>
                                                        <Text style={[ styles.text_White , styles.textBold, styles.textSize_14, styles.textLeft, styles.Width_100 , styles.marginVertical_10,]}>
                                                            {chat.msg}
                                                        </Text>
                                                        <Text style={[styles.text_White ,styles.textBold, styles.textSize_11, styles.rowLeft]}>{chat.date}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            :
                                            <View key={i} style={{ flexDirection : 'row-reverse', justifyContent : 'space-between', margin : 10 }}>
                                                <View style={[styles.width_50, styles.height_50, { flexBasis : '15%', justifyContent : 'center',alignItems: 'center' } ]}>
                                                    <Image style={{ width : 45, height : 45, borderRadius : 25 }} source={{uri : chat.img}} resizeMode='cover'/>
                                                </View>
                                                <View style={{flexBasis : '85%'}}>
                                                    <View style={{backgroundColor :'#00374B', borderRadius : 30, borderTopRightRadius : 0 ,paddingVertical : 5, paddingHorizontal : 20}}>
                                                        <Text style={[ { color: '#fff' }, styles.textBold, styles.textSize_14, styles.textLeft, styles.marginVertical_10 ]}>
                                                            {chat.msg}
                                                        </Text>
                                                        <Text style={[{ color: '#fff' }, styles.textBold, styles.textSize_11, styles.rowLeft]}>{chat.date}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                    )
                                })
                            }
                        </View>
                    </ScrollView>
                        <View style={[styles.Width_100, styles.rowGroup, styles.paddingHorizontal_5, styles.bg_White, styles.paddingVertical_10, styles.position_A, styles.right_0,{ zIndex : 999, bottom : this.state.massStatus ? 50 : 0 }]}>

                        {
                            this.state.messageErr ?
                                <View style={[styles.flex_100]}>
                                    <Text style={[styles.text_red, styles.textSize_14, styles.textRegular, styles.textDir, styles.paddingHorizontal_10, { marginBottom : 10 }]}>
                                        {this.state.messageErr}
                                    </Text>
                                </View>
                                :
                                <View/>
                        }
                        <View style={{ flexBasis : '85%', paddingHorizontal : 5 }}>
                            <Textarea
                                onChangeText                = {(message)=> { this.setState({message:message})}}
                                style                       = {{
                                    borderWidth             : 1,
                                    borderColor             : '#f4f4f4',
                                    borderRadius            : 10,
                                    textAlign               : 'right',
                                    fontFamily              : 'CairoRegular',
                                    padding                 : 20,
                                    width                   : '97%',
                                    backgroundColor         : '#ecebea'
                                }}
                                onBlur                      = {() => this.unActiveInput()}
                                onFocus                     = {() => this.activeInput()}
                                placeholder                 = {I18n.translate('message')}
                                value                       = {this.state.message}
                            />
                        </View>
                        <View style={[ styles.flexCenter  , { flexBasis : '15%' } ]}>
                            <Button onPress={() => this.sendMessage()} style={[styles.bg_darkGreen , styles.width_50, styles.height_50, styles.flexCenter, styles.Radius_30]}>
                                {
                                    !this.state.loadChat ?
                                        <Icon
                                            style={[styles.text_White, styles.textSize_20]}
                                            type="Ionicons"
                                            name='paper-plane'
                                        />
                                        :
                                        <ActivityIndicator size="small" color="#fff" />
                                }
                            </Button>
                        </View>
                    </View>
                </KeyboardAvoidingView>

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
export default connect(mapStateToProps, {profile})(ChatRoom);
