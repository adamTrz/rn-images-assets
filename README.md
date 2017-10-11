# rn-images-assets


## _Copy images from given path to Android and iOS assets directories._


### Why?
##### Because I'm lazy :bowtie:
Instead of `require`-ing all images in our app like so: `<Image source={require('../../assets/img/react.png')} />`
we can write `<Images source={uri: 'react'} />`. 


Isn't that prettier? :smirk:

##### Also
When you `require` image from assets directory, React-Native should load them faster. *[source needed]*

### Usage description
1. Instal globally:

   `$ npm i -g rn-images-assets` or

   `$ yarn add global rn-images-assets`

2. Inside your `react-native` project:
   
   `$ rn-images-assets ./path/to/images/folder -p optional_ios_oprojectName`


This should copy all images to respective iOS and Android directories.


> Note: Any time you add new resources you will need to re-build your app before you can use it - a reload from within the simulator is not enough.
 