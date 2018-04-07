import React from 'react';
import {
	Animated,
	Dimensions,
	TouchableOpacity,
	View,
  Easing,
  Text,
} from 'react-native';
import {
	LinearGradient,
} from 'expo';
import styled from 'styled-components/native';
import EStyleSheet from 'react-native-extended-stylesheet';

import PlatformList from './platform-list';

const image = require('../assets/images/zelda.png')

const animationDuration = 500;

export default class GameComponent extends React.Component {
	state = {
    animationProgression: new Animated.Value(0),
    display: 'normal',
    layouts: null,
	}

  constructor(props) {
    super(props)

    this._handlePress = this._handlePress.bind(this)
    this._toggleDetails = this._toggleDetails.bind(this)
    this._saveLayout = this._saveLayout.bind(this)

    this._renderNotDetailedGame = this._renderNotDetailedGame.bind(this)
    this._renderDetailedGame = this._renderDetailedGame.bind(this)
  }

  _handlePress = () => {
    const {
      toggleGameDetails,
    } = this.props;

    toggleGameDetails(this.props);
  }

  _saveLayout(event) {
    if (!this.state.layouts) {
      this.setState({
        layouts: {
          normal: event.nativeEvent.layout,
          detailed: {
            height: event.nativeEvent.layout.height * 2.2,
            width: event.nativeEvent.layout.width,
          },
        },
      });
    }
  }

	_toggleDetails() {
    const {
			isDetailed,
    } = this.props;
    
    const {
      animationProgression,
    } = this.state;
    
    const startValue = isDetailed ? 1 : 0
    const endValue   = isDetailed ? 0 : 1

    animationProgression.setValue(startValue);
    Animated.timing(
      animationProgression,
      {
        easing: Easing.easeInOut,
        duration: animationDuration,
        toValue: endValue,
      }
    ).start();
	}

	componentWillUpdate(nextProps) {
		const {
			isDetailed,
		} = this.props;

		if (nextProps.isDetailed !== isDetailed) {
      this._toggleDetails()
		}
	}

  _renderNotDetailedGame() {
    const {
			name,
		} = this.props;
    
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <Name
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {name}
        </Name>
        <Game>
          <Cover
            resizeMode="cover"
            source={image}
          >
            <LinearGradient
              style={styles.overlay}
              colors={['transparent', 'rgba(0,0,0,0.7)']}
            /> 
          </Cover>
          <PlatformList
            {...this.props}
          />
        </Game>
      </View>
    )
  }

  _renderDetailedGame() {
    const {
			name,
		} = this.props;
    
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fafafa80'
        }}
      >
        <Game>
          <Text>
            {name}
          </Text>
          <PlatformList
            {...this.props}
          />
        </Game>
      </View>
    )
  }

	render() {
    const {
      isDetailed,
    } = this.props;

		const {
      animationProgression,
      layouts,
		} = this.state

    const normalLayout = layouts ? layouts.normal : {
      height: height / 3,
      width: 0,
    }

    const detailedLayout = layouts ? layouts.detailed : {
      height: height / 3,
      width: 0,
    }

    const heightAnimProgress = animationProgression.interpolate({
      inputRange: [0, 1],
      outputRange: [normalLayout.height, detailedLayout.height],
    });

    const marginAnimProgress = animationProgression.interpolate({
      inputRange: [0, 1],
      outputRange: [10, 5],
    });

    return (
      <Animated.View
        onLayout={this._saveLayout}
        style={{
          height: heightAnimProgress,
          marginLeft: marginAnimProgress,
          marginRight: marginAnimProgress,
        }}
      >
        <TouchableOpacity
          activeOpacity={.5}
          onPress={this._handlePress}
          style={{
            flex: 1,
          }}
        >
          {(isDetailed) ? this._renderDetailedGame() : this._renderNotDetailedGame()}
        </TouchableOpacity>
      </Animated.View>
		);
	}
}

const {
	height,
} = Dimensions.get('window');

const Game = styled.View`
  flex: 1;
	margin-top: 15;
	border-color: #e3e3e3;
	border-width: 3;
	border-radius: 5;
	background-color: transparent;
	overflow: hidden; // to avoid the image to be on top of the border
`;

const Name = styled.Text`
	position: absolute;
	top: 5;
	width: 100%;
	textAlign: left;
	color: black;
	background-color: transparent;
	alignItems: center;
	fontSize: 8;
	paddingLeft: 5;
`;

const Cover = styled.Image`
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	background-color: transparent;
`;

const styles = EStyleSheet.create({
	overlay: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: '70%',
		bottom: 0,
	}
});
