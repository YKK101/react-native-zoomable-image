import React from 'react'
import {
  Image,
  Dimensions,
} from 'react-native'

const FullScreenImage = (props) => {
  return (
    <Image
      style={styles.image}
      resizeMode="contain"
      {...props}
    />
  )
}

const styles = {
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }
}

export default FullScreenImage