import React, { Component } from 'react'
import {
  View,
  Animated,
  PanResponder,
  ScrollView,
  Dimensions,
  Platform,
 } from 'react-native'

const DIFF_ZOOM_SCALE = 0.1
const MAX_ZOOM = 10
const MIN_ZOOM = 0.5
const MAX_SCALE = 5
const MIN_SCALE = 1

function withTransformable(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props)

      this.state = {
        latestTranslateX: 0,
        latestTranslateY: 0,
        translateX: 0,
        translateY: 0,
        scale: 1,
        width: 0,
        height: 0,
      }

      this.historyZoomDistance = 0
      this.createPanResponder()
    }

    // onLayout
    onLayout = ({ nativeEvent }) => {
      const { layout } = nativeEvent
      const { width, height } = layout
      this.setState({ width, height })
    }

    // Pan gesture
    createPanResponder = () => {
      this.panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: this.onMoveShouldSetPanResponder,
        onPanResponderMove: this.onPanResponderMove,
        onPanResponderRelease:this.onPanResponderRelease,
      })
    }

    onMoveShouldSetPanResponder = (_, gestureState) => {
      return this.state.scale > 1 || gestureState.numberActiveTouches >= 2
    }

    onPanResponderMove = (event, gestureState) => {
      if(gestureState.numberActiveTouches >= 2) {
        const { nativeEvent } = event
        const { touches } = nativeEvent
        this.calculateZoomType(touches[0], touches[1])
      } else {
        const { dx, dy } = gestureState
        this.calculateScrollX(dx)
        this.calculateScrollY(dy)
      }
    }

    onPanResponderRelease = () => {
      this.resizeToScaleLimit()
      this.resetScroll()
    }

    // Scroll handler
    calculateScrollX = (dX) => {
      this.setState(prev => {
        let translateX = prev.latestTranslateX + dX
        const maxTranslateX = (prev.scale * prev.width - prev.width) / 2
        if (translateX > maxTranslateX) { translateX = maxTranslateX }
        else if (translateX < -maxTranslateX) { translateX = -maxTranslateX }
        return { translateX }
      })
    }

    calculateScrollY = (dY) => {
      this.setState(prev => {
        let translateY = prev.latestTranslateY + dY
        const maxTranslateY = (prev.scale * prev.height - prev.height) / 2
        if (translateY > maxTranslateY) { translateY = maxTranslateY }
        else if (translateY < -maxTranslateY) { translateY = -maxTranslateY }
        return { translateY }
      })
    }

    resetScroll = () => {
      this.setState(prev => {
        if (prev.scale === 1) {
          return {
            translateX: 0,
            translateY: 0,
            latestTranslateX: 0,
            latestTranslateY: 0
          }
        } else {
          return {
            latestTranslateX: prev.translateX,
            latestTranslateY: prev.translateY,
          }
        }
      })
    }

    // Zoom handler
    calculateZoomType = (firstTouchPoint, secondTouchPoint) => {
      const dX = firstTouchPoint.pageX - secondTouchPoint.pageX
      const dY = firstTouchPoint.pageY - secondTouchPoint.pageY
      const distance = Math.sqrt( (dX * dX) + (dY * dY) )
      
      if(distance > this.historyZoomDistance) {
        this.zoomIn()
      } else {
        this.zoomOut()
      }

      this.historyZoomDistance = distance
    }

    zoomIn = () => {
      this.setState(prev => {
        scale = prev.scale + DIFF_ZOOM_SCALE
        if (scale > MAX_ZOOM) { scale = MAX_ZOOM }

        return { scale }
      })
    }

    zoomOut = () => {
      this.setState(prev => {
        scale = prev.scale - DIFF_ZOOM_SCALE
        if (scale < MIN_ZOOM) { scale = MIN_ZOOM }
        
        return { scale }
      })
    }

    resizeToScaleLimit = () => {
      this.setState(prev => {
        scale = prev.scale
        if (scale < MIN_SCALE) { scale = MIN_SCALE }
        else if (scale > MAX_SCALE) { scale = MAX_SCALE }
        
        return { scale }
      })
    }

    render() {
      const layout = {
        width: this.state.width,
        height: this.state.height,
      }

      const Child = <WrappedComponent onLayout={this.onLayout} {...this.props} />

      if (Platform.OS==='android') {
        return (
          <Animated.View
            style={{
              ...layout,
              transform: [
                { translateX: this.state.translateX },
                { translateY: this.state.translateY },
                { scale: this.state.scale },
              ]
            }}
            {...this.panResponder.panHandlers}
          >
            {Child}
          </Animated.View>
        )
      }

      return (
        <ScrollView
          style={layout}
          minimumZoomScale={MIN_SCALE}
          maximumZoomScale={MAX_SCALE}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {Child}
        </ScrollView>
      )
    }
  }
}

export default withTransformable