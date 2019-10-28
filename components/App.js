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
      characterLevel: 50,
      totalPoints: this._calculatePoints(50),
      // We always use 1, but this is updated by itself anyway. It's just being
      // set for correctness.
      globalUsedPoints: 1,
    };

    this.data = {
      cleric: new ClassSkills("Cleric", this.props.clericData),
      rifleman: new ClassSkills("Rifleman", this.props.riflemanData),
    };

    // make sure we bind this since we're calling it at a later time.
    this._updateGameClassName = this._updateGameClassName.bind(this);
  }

  _calculatePoints(level) {
    level = parseInt(level);
    return level + Math.max(level - 50, 0);
  }

  _updateGlobalUsedPoints(points) {
    this.setState({
      globalUsedPoints: this.state.globalUsedPoints + points,
    })
  }

  _remainingPoints(points) {
    return this.state.totalPoints - this.state.globalUsedPoints;
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
                characterLevel: this.state.characterLevel,
                updateGlobalUsedPoints: this._updateGlobalUsedPoints.bind(this),
                remainingPoints: this._remainingPoints(),
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
      totalPoints: this._calculatePoints(this.state.characterLevel),
    }));
  }

  _updateCharacterLevel(level) {
    this.setState({
      characterLevel: parseInt(level),
      totalPoints: this._calculatePoints(level),
    });
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
        currentSelectedLevel: this.state.characterLevel,
        classMap: this.fetchClasses(),
        updateGameClassName: this._updateGameClassName,
        updateCharacterLevel: this._updateCharacterLevel.bind(this),
        remainingPoints: this._remainingPoints(),
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
