import React, { Component } from 'react'
import FullScreenImage from './libs/FullScreenImage'
import TransfromableObject from './libs/TransfromableObject';

class ZoomableImage extends Component {
  render() {
    return (
      <TransfromableObject>
        <FullScreenImage
          source={this.props.image}
        />
      </TransfromableObject>
    )
  }
}

export default ZoomableImage