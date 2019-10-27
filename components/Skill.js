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

  // The minimum level for this skill.
  minLevel() {
    // TODO: We need to make the lvl 1 skills always have 1 by default.
    return 0;
  }

  // The maximum level for this skill.
  maxLevel() {
    return this.dataPerLevel.length;
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

    const cols = React.createElement('div', {className: 'row'}, tierComps);
    return React.createElement('div', {className: 'container'}, cols);
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

    const tierElem = React.createElement(
      'div',
      {className: "tier col-5 bg-light"},
      entries,
    );
    return tierElem;


  }
}

// Component that displays an individual skill.
class Skill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // This SkillDataSet associated with this component.
      skill: this.props.skill,
      // The current level this skill is set to.
      currLevel: this.props.skill.minLevel(),
    };

    this.minSkillLevel = this.props.skill.minLevel();
    this.maxSkillLevel = this.props.skill.maxLevel();
  }

  modifyUp(modifier) {
    var fn = function () {
      var currLevel = this.state.currLevel + modifier;
      currLevel = Math.max(this.minSkillLevel, currLevel);
      currLevel = Math.min(this.maxSkillLevel, currLevel);
      this.setState(state => ({
        currLevel: currLevel,
      }));
    };
    fn = fn.bind(this);
    return fn;
  }

  arrowComponent(className, modifier) {
    return React.createElement(
        'div',
        {onClick: this.modifyUp(modifier), className: className},
    )
  }

  render() {

    const nameElem = React.createElement('span', null, this.state.skill.name);
    const levelElem = React.createElement('span', null, this.state.currLevel);

    return React.createElement(
      'div',
      {className: 'skill'},
      nameElem,
      levelElem,
      this.arrowComponent('upArrow', 1),
      this.arrowComponent('downArrow', -1),
    );
  }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(
  React.createElement(App, {clericData: Cleric}),
  domContainer
 );
