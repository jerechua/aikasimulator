'use strict';

import {Cleric} from '../SkillData/Cleric.js';

// Holds information about a class and all of its skills.
class ClassSkills {
  constructor(className, rawData) {
    this.className = className;
    this.skills = []
    for (var i = 0; i < rawData.skillDescription.length; i++) {
      this.skills.push(new SkillDataSet(
          rawData["skillDescription"][i],
          rawData["skillInfo"][i],
          rawData["cd"][i],
          rawData["mp"][i],
          rawData["cast"][i],
          rawData["skillLevel"][i],
       ));
    }

  }
}

// Holds information about a single skill, for all levels.
class SkillDataSet {
  constructor(name, skillInfo, cd, mp, cast, level) {
    this.dataPerLevel = []
    for (var i = 0; i < level.length; i++) {
      this.dataPerLevel.push(new SkillData(
          name,
          skillInfo[i],
          cd[i],
          mp[i],
          cast[i],
          level[i],
      ));
    }
  }
}

// Holds information about a single skill for a given level.
class SkillData {
  constructor(name, skillInfo, cd, mp, cast, level) {
    this.name = name;
    this.skillInfo = skillInfo;
    this.cd = cd;
    this.mp = mp;
    this.cast = cast;
    this.level = level;
  }
}


// Main application component.
class App extends React.Component {
  constructor(props) {
    super(props);
    this.data = {
      cleric: new ClassSkills("Cleric", this.props.clericData),
    };
  }
  render() {
    return React.createElement('div', null, React.createElement(Tier))
  }
}

// Component that displays a group of skills by tier.
class Tier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {words: "false"}
  }
  render() {
    const entries = [];
    entries.push(React.createElement(Skill, {key: '1', text: 'hi'}));
    entries.push(React.createElement(Skill, {key: '2', text: 'hello'}));
    return React.createElement('div', null, entries)
  }
}

// Component that displays an individual skill.
class Skill extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: this.props.text };
  }

  render() {
    return React.createElement(
      'button',
      // { onClick: () => this.setState({ liked: true }) },
      null,

      this.state.text
    );
  }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(
  React.createElement(App, {clericData: Cleric}),
  domContainer
 );
