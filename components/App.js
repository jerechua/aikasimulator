'use strict';

import {ClassSkills} from './Skill.js';
import {Cleric} from '../SkillData/Cleric.js';
import {Rifleman} from '../SkillData/Rifleman.js';
import {Settings} from './Settings.js';
import {Tier} from './Tier.js';

// Main application component.
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // This name should match an entry in data so we can access it using this
      // name as key (or just toLowerCase()).
      className: 'cleric',
    };
    this.data = {
      cleric: new ClassSkills("Cleric", this.props.clericData),
      rifleman: new ClassSkills("Rifleman", this.props.riflemanData),
    };

    // make sure we bind this since we're calling it at a later time.
    this._updateGameClassName = this._updateGameClassName.bind(this);
  }

  tierComponent() {
    const tierComps = [];
    this.data[this.state.className].forEachTier(function(skills, tier) {
      tierComps.push(
          React.createElement(
              Tier,
              {
                key: tier,
                tier: tier,
                skills: skills,
                className: this.state.className,
              },
          ));

      // Add some coloumn breaks every numCols tiers.
      const numCols = 2;
      if (((tier-1) % numCols) == (numCols - 1)) {
        tierComps.push(React.createElement(
            'div',
            {
              key: 'colbreak-' + tier,
              className: 'w-100'
            }
        ));
      }
    }.bind(this))
    return React.createElement('div', {className: 'row'}, tierComps);
  }

  _updateGameClassName(className) {
    // TODO: Do some error handling?
    this.setState(state => ({
      // Make sure we always use lowercase as the key for classes to match
      // this.data.
      className: className.toLowerCase(),
    }));
  }

  fetchClasses() {
    var nameMap = {}
    for (var k in this.data) {
      nameMap[k] = this.data[k].name();
    }
    return nameMap;
  }

  render() {
    return React.createElement(
      'div',
      {className: 'container main-container'},
      React.createElement(Settings, {
        currentSelectedClass: this.state.className,
        classMap: this.fetchClasses(),
        updateGameClassName: this._updateGameClassName,
      }),
      this.tierComponent());
  }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(
  React.createElement(App, {
    clericData: Cleric,
    riflemanData: Rifleman,
  }),
  domContainer
 );
