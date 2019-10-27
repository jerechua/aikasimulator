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
    this.skillsByTier = this._allSkillsByTier(this.skills, 6);
  }

  _allSkillsByTier(skills, skillsPerTier) {
    const skillsByTier = [];
    var tier = [];
    skills.forEach(function(val, index) {
      tier.push(val);
      if ((index % skillsPerTier) == (skillsPerTier - 1)) {
        skillsByTier.push(tier);
        tier = [];
      }
    });
    if (tier.length > 0) {
      skillsByTier.push(tier);
    }
    return skillsByTier;
  }

  forEachTier(cb) {
    this.skillsByTier.forEach(function(tier, index) {
      // index + 1 since we always start at 1.
      cb(tier, index + 1);
    })
  }
}

// Holds information about a single skill, for all levels.
class SkillDataSet {
  constructor(name, skillInfo, cd, mp, cast, level) {
    this.name = name;
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
    const tierComps = [];
    this.data.cleric.forEachTier(function(skills, tier) {
      tierComps.push(
          React.createElement(Tier, {key: tier, tier: tier, skills: skills}));
    })

    return React.createElement('div', null, tierComps);
  }
}

// Component that displays a group of skills by tier.
class Tier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tier: this.props.tier,
      skills: this.props.skills,
    };
  }
  render() {
    const entries = [];
    this.props.skills.forEach(function(skill, index) {
      entries.push(React.createElement(Skill, {key: index, skill: skill}));
    });
    return React.createElement('div', null, entries)
  }
}

// Component that displays an individual skill.
class Skill extends React.Component {
  constructor(props) {
    super(props);
    this.state = { skill: this.props.skill };
  }

  render() {
    return React.createElement(
      'button',
      // { onClick: () => this.setState({ liked: true }) },
      null,

      this.state.skill.name
    );
  }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(
  React.createElement(App, {clericData: Cleric}),
  domContainer
 );
