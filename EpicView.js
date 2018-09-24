import React, { Component } from 'react';
import { TouchableHighlight, Text, View } from 'react-native';
import reactNative from 'react-native';
import { CacheManager, Image } from "react-native-expo-image-cache";

class EpicView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      position: 0,
      imagesLoaded: false,
    };
  }

  componentDidMount() {
    const apiKey = 'Z8p5L30ZCOXLVclsjOwnUbqIErPviUlF6TyjvEMn';
    fetch(`https://api.nasa.gov/EPIC/api/enhanced/images?api_key=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        this.setState({ data });
        this.preloadImages(data);
      });
  }

  // NASAs images are huge, so to make the UI/UX more bareable, let's download
  // all of the images on load
  async preloadImages(data) {
    const urls = data.map(imageData => {
      const uri = this.returnImageUrl(imageData);
      return CacheManager.get(uri).getPath();
    });
    this.setState({imagesLoaded: true});
  }

  returnImageUrl(image) {
    const baseUrl = 'https://epic.gsfc.nasa.gov/archive/enhanced';
    const year = image.image.substring(9, 13);
    const month = image.image.substring(13, 15);
    const day = image.image.substring(15, 17);
    return `${baseUrl}/${year}/${month}/${day}/png/${image.image}.png`;
  }

  renderImage(imageData) {
    const imageUrl = this.returnImageUrl(imageData);
    console.log(imageUrl);
    return (
      <View key={imageData.image} style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Image style={{width: 400, height: 400}} {...{uri: imageUrl}} />
        <Text style={{ color: 'white' }}>
          {imageData.date}
        </Text>
      </View>
    )
  }

  rotateImage() {
    const { data, position } = this.state;
    const newPosition = position + 1;

    if (newPosition === data.length) {
      this.setState({ position: 0 });
      return;
    }

    this.setState({ position: newPosition });
  }

  render() {
    const { data, imagesLoaded, position } = this.state;
    const { title } = this.props;

    if (!data) {
      return null;
    }

    if (!imagesLoaded) {
      return (
        <View style={{flex: 1,  alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{ color: '#ffffff', fontSize: 20 }}>Loading Images...</Text>
        </View>
      )
    }

    const imageData = data[position];
    return (
      <View>
        <View style={{flex: 0.1}} />
        <View style={{flex: 0.1,  alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{ color: '#ffffff', fontSize: 20 }}>{title}</Text>
        </View>
        <View style={{flex: 0.8}}>
          <TouchableHighlight activeOpacity={100} onPress={() => this.rotateImage()}>
            {this.renderImage(imageData)}
          </TouchableHighlight>
        </View>
      </View>
    );
  }

}

export default EpicView;
