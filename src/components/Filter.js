import React, { Component } from 'react';
import {Text, Image, View, ScrollView, TouchableOpacity, Animated,Dimensions} from 'react-native';
import {Container, Content, Header, Left, Body, Right, Button, Icon, Title} from 'native-base';
import Swiper    from 'react-native-swiper';
import Tabs      from './Tabs';
import {connect} from "react-redux";
import {profile, userLogin} from "../actions";
import I18n      from "ex-react-native-i18n";
import axios     from "axios";
import Spinner   from "react-native-loading-spinner-overlay";
import {NavigationEvents}   from "react-navigation";
import CONST     from '../consts';
import styles    from '../../assets/style'
import * as Animatable from "react-native-animatable";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
const width = Dimensions.get('window').width;

class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lang           : this.props.lang,
            isLoaded       : false,
            spinner        : false,
             categories    : [],
            images         : [],
            sliders        : [],
        };
    }

    onFocus(){
        this.runPlaceHolder();
        this.componentWillMount()
    }
   async  componentWillMount() {
        this.setState({ spinner: true });
         axios.post(`${CONST.url}categories`, { lang: this.props.lang }).then( (response)=> {
                this.setState({categories: response.data.data});
                console.log('categories  ' , response.data.data)
                axios.post(`${CONST.url}getSlider`, { lang:  this.props.lang })
                    .then( (response)=> {
                        this.setState({sliders: response.data.data});
                    }).then( ()=> {
                    this.setState({spinner: false});
                })
            })
    }
    _renderRows(loadingAnimated, numberRow, uniqueKey) {
        let shimmerRows = [];
        for (let index = 0; index < numberRow; index++) {
            shimmerRows.push(
                <ShimmerPlaceHolder
                    key={`loading-${index}-${uniqueKey}`}
                    ref={(ref) => loadingAnimated.push(ref)}
                    style={{marginVertical: 7, alignSelf: 'center'}}
                    width={width - 20}
                    height={100}
                    colorShimmer={['#ffffff75', '#dc882e94', '#ffffff75']}
                />
            )
        }
        return (
            <View>
                {shimmerRows}
            </View>
        )
    }

    runPlaceHolder() {
        if (Array.isArray(this.loadingAnimated) && this.loadingAnimated.length > 0) {
            Animated.parallel(
                this.loadingAnimated.map(animate => {
                    if (animate&&animate.getAnimated) {
                        return animate.getAnimated();
                    }
                    return null;
                }),
                {
                    stopTogether: false,
                }
            ).start(() => {
                this.runPlaceHolder();
            })
        }
    }
    render() {
        this.loadingAnimated = [];

        return (

      <Container>
          <Header style={styles.Header_Up}>
              <Left style={[ styles.RightDir,{flex : 1} ]}>
                  <Button transparent onPress={() => this.props.navigation.navigate('mune')}>
                      <Icon style={[ styles.icons ]} type="SimpleLineIcons" name='menu' />
                  </Button>
              </Left>
              <Body style={[styles.body_header,{flex : 1.5}]}>
                  <Title style={styles.headerTitle}>{I18n.translate('categories')}</Title>
              </Body>
          </Header>
          <Content>
              <NavigationEvents onWillFocus={() => this.onFocus()} />

              {
                  this.state.spinner ?
                      this._renderRows(this.loadingAnimated, 5, '5rows')
                      :
                      <View style={styles.block_slider}>
                          <Swiper
                              autoplayTimeout={2.5}
                              showsButtons={false} autoplay={true}
                              nextButton=
                                  {
                                      <View style={styles.Btn}>
                                          <Icon style={styles.Btn_Icon} type="FontAwesome" name='angle-left'/>
                                      </View>
                                  }
                              prevButton=
                                  {
                                      <View style={styles.Btn}>
                                          <Icon style={styles.Btn_Icon} type="FontAwesome" name='angle-right'/>
                                      </View>
                                  }
                              containerStyle={styles.wrapper}>

                              {this.state.sliders.map((slider, i) => {
                                  return (
                                      <View>
                                          <Image style={styles.slide} source={{uri: slider.url}} resizeMode='cover'/>
                                      </View>
                                  )
                              })}
                          </Swiper>
                      </View>
               }


              {
                  this.state.spinner ?
                      this._renderRows(this.loadingAnimated, 5, '5rows')
                      :
                  <Text style={styles.text_headers}>{I18n.translate('special_categories')}</Text>
              }
                  <View style={[ styles.body_container , styles.overHidden ]}>
                      {
                          this.state.spinner ?
                              this._renderRows(this.loadingAnimated, 5, '5rows')
                              :
                          this.state.categories.slice(0,3).map((item , i)=> {
                              return (
                                  <Animatable.View animation="fadeInUp" easing="ease-out" delay={500}>
                                      <TouchableOpacity onPress={()=> this.props.navigation.navigate('Categories',{
                                          category_id : item.id,
                                          name        : item.name
                                      })} style={[styles.overflow, styles.mh_15, styles.body_child]}>
                                          <View style={styles.overflow}>
                                              <Image
                                                  source={{uri : item.icon}}
                                                  style={styles.category_img} resizeMode={'cover'}/>
                                          </View>
                                          <Text style={styles.category_text}>{item.name}</Text>
                                      </TouchableOpacity>
                                  </Animatable.View>
                              );
                          })
                      }
                  </View>
             <Text style={styles.category_text2}>{I18n.translate('all_categories')}</Text>
             <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                 <View style={[ styles.overHidden ]}>
                     <Animatable.View animation="fadeInUp" easing="ease-out" delay={500}>
                         <View style={[ styles.body_container , styles.overHidden ]}>
                                {
                                 this.state.categories.map((item, i) => {
                                     return (
                                         <TouchableOpacity onPress={()=> this.props.navigation.navigate('Categories',{
                                             category_id : item.id,
                                             name        : item.name
                                         })} style={[styles.overflow, styles.mh_15, styles.body_child]}>
                                             <View style={styles.overflow}>
                                                 <Image
                                                     source={{uri : item.icon}}
                                                     style={styles.category_img} resizeMode={'cover'}/>
                                             </View>
                                             <Text style={styles.category_text}>{item.name}</Text>
                                         </TouchableOpacity>
                                      );
                                 })
                                }
                         </View>
                     </Animatable.View>
                  </View>
             </ScrollView>
        </Content>
        <Tabs routeName="filter"  navigation={this.props.navigation}/>
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
export default connect(mapStateToProps, { userLogin ,profile})(Filter);


