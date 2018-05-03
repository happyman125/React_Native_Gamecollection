import _ from 'lodash'
import React from 'react'
import { BlurView } from 'expo'
import styled from 'styled-components/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import {
  Animated,
  Easing,
} from 'react-native'

import { cacheImages } from '@utils'

import CompleteDetailedGame from '@components/complete-detailed-game'
import CompleteNotDetailedGame from '@components/complete-not-detailed-game'
import IncompleteNotDetailedGame from '@components/incomplete-not-detailed-game'

const animationDuration = 250

export default class GameWrapperComponent extends React.Component {
  state = {
    animationProgression: new Animated.Value(0),
  }

  static defaultProps = {
    normalMargin: 10,
    detailedMargin : 5,
  };

  componentWillMount() {
    const {
      normalHeight,
      detailedHeight,
      normalMargin,
      detailedMargin,
      requestGamePartialCompletion,
      game,
    } = this.props

    const {
      animationProgression,
    } = this.state

    const heightAnimProgress = animationProgression.interpolate({
      inputRange: [0, 1],
      outputRange: [normalHeight, detailedHeight],
    })

    const marginAnimProgress = animationProgression.interpolate({
      inputRange: [0, 1],
      outputRange: [normalMargin, detailedMargin],
    })

    this.setState({
      heightAnimProgress,
      marginAnimProgress,
    })

    if (game.completionLevel < 2) {
      requestGamePartialCompletion()
    }

    const {
      image,
      images = [],
    } = game

    let cachedImages = []

    if (image) {
      cachedImages.push(image)
    }

    if (images) {
      cachedImages = _.concat(cachedImages, images)
    }

    cacheImages(
      cachedImages.reduce(
        (acc, currentImage) => {
          acc.push(currentImage.tiny_url)
          acc.push(currentImage.medium_url)

          return acc
        },
        []
      )
    )
  }

  componentWillUpdate(nextProps) {
    const {
      scrollToMe,
      isDetailed,
    } = this.props;

    if (nextProps.isDetailed !== isDetailed) {
      this._toggleDetails()
    }

    if (nextProps.isDetailed) {
      scrollToMe()
    }
  }

  _toggleDetails = () => {
    const {
      isDetailed,
    } = this.props

    const {
      animationProgression,
    } = this.state

    const startValue = isDetailed ? 1 : 0
    const endValue = isDetailed ? 0 : 1

    animationProgression.setValue(startValue)
    Animated.timing(
      animationProgression,
      {
        easing: Easing.easeInOut,
        duration: animationDuration,
        toValue: endValue,
      }
    ).start()
  }

  render() {
    const {
      game,
      isDetailed,
      showGameDetails,
      hideGameDetails,
      togglePlatformOwnership,
    } = this.props

    const {
      heightAnimProgress,
      marginAnimProgress,
    } = this.state

    return (
      <Animated.View
        style={{
          height: heightAnimProgress,
          marginLeft: marginAnimProgress,
          marginRight: marginAnimProgress,
        }}
      >
        <GameWrapper>
          {
            (game.completionLevel < 2) ? (
              <IncompleteNotDetailedGame
                {...game}
              />
            ) : (
              (!isDetailed) ? (
                <CompleteNotDetailedGame
                  {...game}
                  showGameDetails={showGameDetails}
                />
              ) : (
                <CompleteDetailedGame
                  {...game}
                  hideGameDetails={hideGameDetails}
                  togglePlatformOwnership={togglePlatformOwnership}
                />
              )
            )
          }
          {
            game.isOwned ? (
              <OwnershipMarkerWrapper>
                <OwnershipMarker />
                <OwnershipMarkerCheck />
              </OwnershipMarkerWrapper>
            ) : (
              null
            )
          }
        </GameWrapper>
      </Animated.View>
    )
  }
}

const GameWrapper = styled.View`
  flex: 1;
  margin-bottom: 10;
  border-color: #e3e3e3;
  border-width: 1;
  border-radius: 5;
`

const OwnershipMarkerWrapper = styled.View`
  position: absolute;
  top: -10;
  right: 0;
  height: 40;
  width: 40;
`

const OwnershipMarkerCheck = styled(MaterialCommunityIcons).attrs({
  name: 'check'
})`
  position: absolute;
  top: 7;
  right: 11;
  font-size: 20;
  color: #ffffff;
`

const OwnershipMarker = styled(MaterialCommunityIcons).attrs({
  name: 'bookmark'
})`
  font-size: 40;
  color: #eb2b36;
`
