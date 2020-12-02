import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import {Container, Icon, Content, Button, Title, Text, View, Body, Right, Header, Left} from 'native-base';
import I18n from "ex-react-native-i18n";
import styles from '../../assets/style'



class AddE3lan extends React.Component {

    constructor(props) {
        super(props);
    }


  render() {
    return (
      <Container>

          <Header style={[styles.Header_Up]}>
              <Left style={[ styles.RightDir ,styles.flex]}>
                  <Button transparent onPress={() => this.props.navigation.navigate('mune')}>
                      <Icon style={[ styles.icons ]} type="SimpleLineIcons" name='menu' />
                  </Button>
              </Left>
              <Body style={[styles.body_header,styles.flex]}>
                  <Title style={styles.headerTitle}>{I18n.translate('add_Ads')}</Title>
              </Body>
              <Right style={[ styles.RightDir ,styles.flex]}>
                  <Button transparent onPress={()=> this.props.navigation.goBack()} >
                      <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                  </Button>
              </Right>
          </Header>

        <Content contentContainerStyle={{ flexGrow: 1 }}>

        <View style={styles.content}>
            <View style={styles.fixed_top}>
                     <TouchableOpacity style={styles.fixed_btn} onPress={() => this.props.navigation.navigate('termse3lan',{
                         type : 1
                     })}>
                        <Text style={styles.text_btn}>{I18n.translate('free_Ads')}</Text>
                    </TouchableOpacity>


                     <TouchableOpacity style={[styles.fixed_btn,{backgroundColor:'#4b4b4b'}]} onPress={() => this.props.navigation.navigate('termse3lan' ,{
                         type : 2
                     })}>
                        <Text style={styles.text_btn}>{I18n.translate('photo_ads')}</Text>
                    </TouchableOpacity>
            </View>
        </View>

        </Content>

      </Container>
    );
  }
}


export default AddE3lan;
