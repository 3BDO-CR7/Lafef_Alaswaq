import React, { Component } from 'react';
import { StyleSheet, Text, Image, View, I18nManager,TouchableOpacity } from 'react-native';
import  { Container, Content, Button, Icon, Title} from 'native-base';

import i18n from '../../locale/i18n';
import { connect } from 'react-redux';
import { chooseLang } from '../actions';
import * as Animatable from 'react-native-animatable';
import styles from '../../assets/style'

class Language extends Component {

    constructor(props){
        super(props);
        this.state          = {};
        this.onChooseLang   = this.onChooseLang.bind(this);
        this.state = {
            spinner                     : false,
            lang                        : '',
            active                      : 0,
        }
    }

  onChooseLang(lang) {
      this.props.chooseLang(lang);
      this.props.navigation.navigate('home');
  };

    componentWillMount() {

        const lang  = this.props.lang;

        this.setState({ lang : this.props.lang });

        console.log('lang', lang)

        if(lang === 'ar'){
            this.setState({ active : 1 });
        }else if (lang === 'en'){
            this.setState({ active : 2 });
        }

        this.setState({spinner: true});

    }


  render() {
    return (
      <Container style={{ backgroundColor :'#3c95a9' }}>
      <Content contentContainerStyle={{ flexGrow: 1  }}>

            <View style={[styles.blockAbout_lang , {flexGrow: 1 }]}>

                <View style={styles.overHidden}>
                <Animatable.View animation="fadeInUp" easing="ease-out" delay={500}>
                        <Image style={styles.logo_lang} source={require('../../assets/lang.png')}/>
                </Animatable.View>
                </View>


              <View style={[styles.boxLang,styles.mt60]}>

                  <Animatable.View animation="fadeIn" easing="ease-out" delay={400} style={styles.fullWidth}>
                        <TouchableOpacity onPress={() => this.onChooseLang('ar')} style={[ styles.rowGroups , {
                            borderWidth         : 1,
                            borderColor         : (this.state.active === 1) ? '#00374B' : '#DDD',
                            marginVertical      : 10,
                            width               : '100%',
                            padding             : 5,
                        } ]}>
                            <Text style={[styles.text,{color : '#00374B'}]}>العربيه</Text>
                            {
                                (this.state.active === 1) ?
                                    <Image style={styles.icologo_lang} source={require('../../assets/check_green.png')}/>
                                    :
                                    <View/>
                            }
                        </TouchableOpacity>
                  </Animatable.View>

                  <Animatable.View animation="fadeIn" easing="ease-out" delay={300} style={styles.fullWidth}>
                        <TouchableOpacity onPress={() => this.onChooseLang('en')} style={[ styles.rowGroups , {
                            borderWidth         : 1,
                            borderColor         : (this.state.active === 2) ? '#00374B' : '#DDD',
                            marginVertical      : 10,
                            width               : '100%',
                            padding             : 5,
                        } ]}>
                            <Text style={[styles.text,{color : '#00374B'}]}>English</Text>
                            {
                                (this.state.active === 2) ?
                                    <Image style={styles.icologo_lang} source={require('../../assets/check_green.png')}/>
                                    :
                                    <View/>
                            }
                        </TouchableOpacity>
                  </Animatable.View>


              </View>

            </View>

      </Content>

      </Container>
    );
  }
}


const mapStateToProps = ({ auth, profile, lang }) => {
    return {
        auth: auth.user,
        user: profile.user,
        lang: lang.lang
    };
};

export default connect(mapStateToProps, { chooseLang })(Language);

