import React, { Component } from 'react';
import {
    Text,
    Image,
    View,
    TouchableOpacity,
    ScrollView,
    LayoutAnimation,
    Dimensions,
    Animated,
    Platform, UIManager
} from 'react-native';
import {Container, Content, Button, Icon, Header, Left, Body, Right, ListItem, Radio, Toast, Title} from 'native-base';
import I18n from "ex-react-native-i18n";
import Spinner from "react-native-loading-spinner-overlay";
import axios from "axios";
import {connect} from "react-redux";
import {profile} from "../actions";
import styles from '../../assets/style'
import CONST from '../consts';
import * as Animatable from "react-native-animatable";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import i18n from "../../locale/i18n";
const width = Dimensions.get('window').width;
class SelectCategory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page             : 'forme3lan',
            type             : 1,
            spinner          : true,
            text             : '',
            categories       : [] ,
            lang             : this.props.lang,
            sub_category_id  : null,
            selected_id      : null,
            sub_categories   : [],
            parents          : [],
            pressed          : [],
            expanded         : false,
            name             : '',
            nameCar          : '',
        };
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    async componentWillMount() {
        this.runPlaceHolder();
        axios.post(`${CONST.url}sub_categories`, {
            lang : this.props.lang ,
            id   : 1
        }).then( (response)=> {
            this.setState({
                sub_categories: response.data.data
            });
        });

        axios.post(`${CONST.url}categoriesList`, {
            lang: this.props.lang ,
        }).then( (response)=> {
            this.setState({parents: response.data.data,spinner: false});
        })

    }

    showToast(){
        Toast.show({
            text: I18n.t('choose_category'),
            duration : 2000  ,
            type :"danger",
            textStyle: {
                color: "white",
                fontFamily : 'CairoRegular' ,
                textAlign:'center'
            }
        });
    }

    changeLayout = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        let pressArray     = this.state.pressed
        pressArray[index]  = pressArray[index] ? false : true
        this.setState({ pressed: pressArray })
    };

    childes (parents) {
        return (
            parents.map((item, index) => {
                return (
                    <View
                        key={item.id}
                        style={{
                            justifyContent: 'center',
                            marginVertical:  3 ,
                            width : '100%'
                        }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {this.changeLayout(item.id);}}
                            style={{margin: 8, borderWidth: .5, borderColor: '#bbb'}}
                        >
                            {
                                    <TouchableOpacity
                                        onPress={()=> {this.filterIt(item.id, item.name, item.car)
                                        this.changeLayout(item.id);}}
                                        style={[{flexDirection:  'row'  ,justifyContent :'space-between' , alignItems:'center' , marginHorizontal : 15 , marginVertical: 10}]}>
                                        <Icon
                                            name={this.state.pressed[item.id] ? 'arrowright' : 'arrowright'} type={'AntDesign'}
                                            style={{fontSize: 15, lineHeight: 20, fontFamily: 'CairoBold', padding: 10}}
                                        />
                                        <View style={[{flexDirection:  'row'  ,justifyContent :'space-between' , alignItems:'center'}]}>
                                            <Text  onPress={()=> {this.filterIt(item.id,item.name, item.car)}} style={{fontSize: 12, fontFamily: 'CairoBold', padding: 8,alignSelf:  'flex-end'}}>{item.name}</Text>
                                            <Image source={{uri : item.icon}}  style={{width : 40 , height : 40 , borderRadius : 20}} />
                                        </View>
                                    </TouchableOpacity>
                            }
                        </TouchableOpacity>
                        <View style={{height: this.state.pressed[item.id] ? null : 0, overflow: 'hidden'}}>
                            {
                                item.childes.map((result) => {
                                    return (
                                        <View style={styles.flex}>
                                            {
                                                (result.childes.length > 0 )?
                                                    this.childes([result])
                                                    :
                                                    <Animatable.View animation="zoomIn" easing="ease-out" delay={500}>
                                                        <ListItem key={result.id} onPress={() => {this.filterIt(result.id,result.name, item.car)}}>
                                                            <Left>
                                                                <TouchableOpacity onPress={()=> {this.filterIt(result.id,result.name, item.car)}}>
                                                                    <Text style={{fontSize: 10, fontFamily: 'CairoBold' }}>{result.name}</Text>
                                                                </TouchableOpacity>
                                                            </Left>
                                                            <Right>
                                                                <TouchableOpacity onPress={()=> {this.filterIt(result.id,result.name, item.car)}}>
                                                                    <Radio selected={this.state.selected_id ===result.id ? true : false}/>
                                                                </TouchableOpacity>
                                                            </Right>
                                                        </ListItem>
                                                    </Animatable.View>
                                            }
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                )
            })
        )
    }
    render() {
        this.loadingAnimated = [];
        return (
            <Container>
                <Header style={styles.Header_Up}>
                    <Body style={[styles.body_header,styles.flex]}>
                        <Animatable.View animation="pulse" iterationCount="infinite"  delay={2000}  style={{alignItems : 'center', justifyContent : 'center'}}>
                            <TouchableOpacity onPress={()=> (this.state.selected_id) ? this.props.navigation.navigate('forme3lan',{category_id : this.state.selected_id, nameCar : this.state.nameCar}) : this.showToast()} style={{ justifyContent : 'center' }}>
                                <Text style={[ styles.headerTitle ,{color : '#fff' , textAlign :'center',fontSize : 18}]}>{i18n.t('continue')}</Text>
                            </TouchableOpacity>
                        </Animatable.View>
                    </Body>
                    <Right style={[ styles.RightDir ,styles.flex]}>
                        <Button transparent onPress={()=> this.props.navigation.goBack()} >
                            <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                        </Button>
                    </Right>
                </Header>
                <Spinner visible={this.state.spinner}/>
                <Content contentContainerStyle={styles.bgFullWidth}>
                    <ScrollView style={[styles.filter_scroll , styles.heightFull ,{width :'100%'}]}>
                        <View style={[styles.filter_model,{width : '100%' , justifyContent:'center'}]}>
                            <Text style={[styles.text_headers2 , {color : CONST.color}]}>{this.state.name}</Text>
                             {
                                this.state.spinner ?
                                    this._renderRows(this.loadingAnimated, 5, '5rows')
                                    :
                                    null
                             }
                             {
                                (this.state.parents.length > 0)?
                                this.childes(  this.state.parents )
                                    :
                                    null
                             }
                        </View>
                    </ScrollView>

                </Content>
            </Container>
        );
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
                    colorShimmer={['#ffffff75', '#f2f0ff', '#ffffff75']}
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

    filterIt(id,name,carID){
        this.setState({selected_id : id,name })
        if (carID === 61){
            this.state.nameCar = 'car';
        }else {
            this.state.nameCar = '';
        }
    }
}

const mapStateToProps = ({ auth, lang ,profile}) => {
    return {
        auth   : auth.user,
        lang   : lang.lang,
        user   : profile.user,
    };
};
export default connect(mapStateToProps,{profile})(SelectCategory);



