import 'aframe';
import 'aframe-layout-component';
import 'babel-polyfill';
import _ from 'underscore';
import {Animation, Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';
import data from '../data/data';

import Camera from './components/Camera';
import Cursor from './components/Cursor';
import Sky from './components/Sky';

class BoilerplateScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: 'yellow',
      layout: 'circle'
    }
  }

  changeColor = () => {
    const colors = ['orange', 'yellow', 'green', 'blue']; 
    this.setState({
      color: colors[Math.floor(Math.random() * colors.length)],
    }); 
  };

  changeLayout = () => {
    const layoutTypes = ['box', 'circle', 'cube', 'dodecahedron', 'line', 'pyramid'];
    this.setState({
      layout: layoutTypes[Math.floor(Math.random() * layoutTypes.length)],
    });
  };

  getLayoutOptions = () => {
    if (this.state.layout === 'circle') {
      return {
        margin: 0,
        radius: 7,
        columns: 0
      };
    } else if (this.state.layout === 'box') {
      return {
        margin: 1.5,
        radius: 0,
        columns: 8
      };
    } else if (this.state.layout === 'line') {
      return {
        margin: 1.5,
        radius: 0,
        columns: 0
      };
    } else if (this.state.layout === 'dodecahedron') {
      return {
        margin: 0, // takes 20 (do deca) boxes
        radius: 20, // leaves rest in prev. config.
        columns: 0
      };
    } else if (this.state.layout === 'pyramid') {
      return {
        margin: 0,
        radius: 20, // renders 4 entity boxes into a pyramid
        columns: 0 // leaving the rest in the previous configuration.
      };
    } else if (this.state.layout === 'cube') {
      return {
        margin: 0, // as pyramid, using 6 boxes
        radius: 20, // rest is left in prev. config.
        columns: 0
      }
    }
  };

  render () {
    var that = this;
    // layout shapes demo
    var currentLayoutOptions = that.getLayoutOptions();

    // general internal
    var len = data.length;
    var datasq = Math.floor(Math.sqrt(len)); // 43 => 6
    var datacb = Math.floor(Math.cbrt(len));
    var dataRangeToSqrt = _.range(0, datasq + 1); // [0, 1, 2, 3, 4, 5, 6]
    var dataRangeToCbrt = _.range(0, datacb ); // 43 => [0, 1, 2, 3]

    // circles and cylinders
    // need to provide an x and z value to position cylinder.
    var circleIterator = datacb;
    var circlePosition;
    var changePosForCylinder = function(z) {   // change Y
      circleIterator--;
      var position = dataRangeToCbrt[circleIterator];
      circlePosition = `0 ${position} ${z}`;
    };
    // rendering for cylinders can be cleaned up.

    return (
      <Scene>
        {/* TODO:
         add onEnterVR, noExitVR, onLoaded -- in props :: functions.
         on load show 2D space
         on click of new button - enter VR
         on enterVR start initial 3d render
         on button or keypress Esc exitVR
         on exitVR go back to 2D representation
         >> use D3 for 2D representation ?
        */}
        <Camera><Cursor/></Camera>

        <Sky/>

        <Entity light={{type: 'ambient', color: '#888'}}/>
        <Entity light={{type: 'directional', intensity: 0.5}} position={[-1, 1, 0]}/>
        <Entity light={{type: 'directional', intensity: 1}} position={[1, 1, 0]}/>


          {/* cylinder as stacked circles */}
          {/*
            TODO: dynamic slicing
            TODO: onMouseEnter: () => {}, // show infobox
                  onMouseLeave: () => {}, // hide infobox

            infobox: curvedsurface? // pane with opacity and text?
              name: name
              bio: bio
              Advanced: 'next' button on pane, transitions to page 2 with:
              email: email
              linkedin: linkedin
          */}
          {dataRangeToCbrt.map(function(i) {
            changePosForCylinder(15);

            return <Entity layout={{type: 'circle', radius: `${datacb}`}} position={circlePosition}>

              {data.slice(0, 15).map(function(person) {
                return <Entity key={person.id} data={person}
                        geometry="primitive: box"
                        material={{src: `url(${person.image})`, color: that.state.color}}
                        onClick={that.changeColor} >
                </Entity>; })}
            </Entity> })}

        {/*another one*/}
        {/*curved surface scatterplot*/}

        {/*another one*/}
        {/*inverted mirrored pyramids (one 0 -> Y++ and another 0 -> Y--)*/}

        {/* controller entity for layout test container */}
        <Entity onClick={that.changeLayout} geometry="primitive: cylinder" material="color: red" position="1 0 -5"> </Entity>

       {/* Layout tests container entity component */}
        <Entity
            layout={{type: `${that.state.layout}`,
            margin: `${currentLayoutOptions.margin}`,
            radius: `${currentLayoutOptions.radius}`,
            columns: `${currentLayoutOptions.columns}` }}
            position="10 1 -10" >

        {data.map(function(person) {
          return <Entity key={person.id} data={person}
                  geometry="primitive: box"
                  material={{src: `url(${person.image})`, color: that.state.color}}
                  onClick={that.changeColor} >
            <Animation attribute="rotation" dur="5000" repeat="indefinite" to="0 360 360"/>
          </Entity>; })}
        </Entity>

      </Scene>
    ); // render ()
  } // render {}
}

ReactDOM.render(<BoilerplateScene/>, document.querySelector('.scene-container'));
