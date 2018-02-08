# react-native-zoomable-image

### Installation
```
npm install react-native-zoomable-image --save
```

### Usage
```
import { ZoomableImage } from 'react-native-zoomable-image'
```
Using this component like <Image /> of React-native
```
<ZoomableImage
  source={{
    uri: 'example.png',
    width: 100,
    height: 100,
  }}
/>
```

or
```
import { withTransformable } from 'react-native-zoomable-image'
```
It's HOC that return component with zoomable options
```
const CustomComponent = () => {
  ...
}

export default withTransformable(CustomComponent)
```

### 1.0 Roadmap
- Unit testing
- Flexible zoom options

### P.S.
Issue reports & pull requests are welcome :)