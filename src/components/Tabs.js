import React, { Component } from 'react';
import {BackHandler, Image, StyleSheet} from 'react-native';
import  { Container,Icon,Footer, FooterTab,Button} from 'native-base';
import {connect} from "react-redux";
import {profile} from "../actions";
import styles from '../../assets/style'

class Tabs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          pageName: this.props.routeName
        };
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
      }



    componentDidMount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillMount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        BackHandler.exitApp()
    }


  render() {

    return (
      <Footer>
          <FooterTab style={styles.footer_Tab}>
            <Button
                onPress={() => this.props.navigation.navigate('home')}
                style={{ borderTopWidth   : this.state.pageName === 'home'? 2 : 0 , borderTopColor : '#00374B' , }}
            >
                {/*<Icon style={{*/}
                {/*    color   : this.state.pageName === 'home'? '#F3A50C' : '#bbb',fontSize : 20*/}
                {/*    // top     : this.state.pageName === 'home'? -5 : 0,*/}
                {/*}}*/}
                {/*type="SimpleLineIcons" name="home" />*/}
                <Image resizeMode='contain' style={{ width : 25, height : 25 }} source={(this.state.pageName === 'home' ? require('../../assets/home_active.png') : require('../../assets/home_gray.png'))}/>
            </Button>
            <Button
                onPress={() => this.props.navigation.navigate('filter')}
                style={{ borderTopWidth   : this.state.pageName === 'filter'? 2 : 0 , borderTopColor : '#00374B' , }}
            >
                {/*<Icon style={{*/}
                {/*    color   : this.state.pageName === 'filter'? '#F3A50C' : '#bbb',fontSize : 20*/}
                {/*    // top     : this.state.pageName === 'filter'? -5 : 0,*/}
                {/*}}*/}
                {/*type="SimpleLineIcons" name='grid' />*/}
                <Image resizeMode='contain' style={{ width : 25, height : 25 }} source={(this.state.pageName === 'filter' ? require('../../assets/menu_orange.png') : require('../../assets/menu_gray.png'))}/>
            </Button>
              <Button style={styles.addE3lan}
                  onPress={() => {
                      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
                      (this.props.auth) ? this.props.navigation.navigate('adde3lan') : this.props.navigation.navigate('login');
                  }}>
                <Icon style={[styles.iconer, {
                    fontSize: 27,
                    color :'#fff'
                    // top     : this.state.pageName === 'filter'? -5 : 0,
                }]}
                type="AntDesign" name='plus' />
            </Button>
            {/*<Button onPress={() => this.props.navigation.navigate('mzadat')}>*/}
                {/*<Icon style={{*/}
                    {/*color   : this.state.pageName === 'mzadat'? '#00374B' : '#444',*/}
                    {/*// top     : this.state.pageName === 'mzadat'? -5 : 0,*/}
                {/*}} */}
                {/*type="Entypo" name='megaphone' />*/}
            {/*</Button>*/}
              <Button
                  onPress={() => {(this.props.auth) ? this.props.navigation.navigate('favorite') : this.props.navigation.navigate('login');}}
                  style={{ borderTopWidth   : this.state.pageName === 'favorite'? 2 : 0 , borderTopColor : '#00374B' , }}
              >
                {/*<Icon style={{*/}
                {/*    color   : this.state.pageName === 'gallery'? '#F3A50C' : '#bbb',transform : [{ rotate: '-30deg'}],fontSize : 20*/}
                {/*    // top     : this.state.pageName === 'gallery'? -5 : 0,*/}
                {/*}}*/}
                {/*type="Octicons" name='megaphone' />*/}
                <Image resizeMode='contain' style={{ width : 25, height : 25 }} source={(this.state.pageName === 'gallery' ? require('../../assets/orange_fav.png') : require('../../assets/gray_fav.png'))}/>
            </Button>

            <Button
                onPress={() => {(this.props.auth) ? this.props.navigation.navigate('chat') : this.props.navigation.navigate('login');}}
                style={{ borderTopWidth   : this.state.pageName === 'chat'? 2 : 0 , borderTopColor : '#00374B' , }}
            >
                {/*<Icon style={{*/}
                {/*    color   : this.state.pageName === 'chat'? '#F3A50C' : '#bbb',fontSize : 25*/}
                {/*    // top     : this.state.pageName === 'chat'? -5 : 0,*/}
                {/*}}*/}
                {/*type="MaterialCommunityIcons" name='email-outline' />*/}
                <Image resizeMode='contain' style={{ width : 25, height : 25 }} source={(this.state.pageName === 'chat' ? require('../../assets/chat_orange.png') : require('../../assets/chat_gray.png'))}/>
            </Button>
          </FooterTab>
        </Footer>
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
export default connect(mapStateToProps, {profile})(Tabs);


