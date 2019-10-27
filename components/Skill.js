'use strict';

import {Tier} from './Tier.js';

// Holds information about a class and all of its skills.
class ClassSkills {
  constructor(className, rawData) {
    this.className = className;
    this.skills = []
    for (var i = 0; i < rawData.skillDescription.length; i++) {
      this.skills.push(new SkillDataSet(
          i + 1,
          this.className,
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

  name() {
    return this.className;
  }
}

// Holds information about a single skill, for all levels.
class SkillDataSet {
  constructor(id, className, name, skillInfo, cd, mp, cast, level) {
    this.id = id;
    this.className = className;
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

  // The name of the in-game class this skill belongs to.
  gameClassName() {
    return this.className;
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

    // The location in GameClassName/imageIndex.jpg
    this.imageLocation = this.props.imageLocation;
  }

  imageComponent() {
    return React.createElement(
        'img', {src: this.imageLocation});
  }

  modifyCurrLevel(modifier) {
    var fn = function () {
      var currLevel = this.state.currLevel + modifier;
      currLevel = Math.max(this.minSkillLevel, currLevel);
      currLevel = Math.min(this.maxSkillLevel, currLevel);
      this.setState(state => ({
        currLevel: currLevel,
      }));
    };
    return fn.bind(this);
  }

  arrowComponent(className, modifier) {
    return React.createElement(
        'button',
        {
          onClick: this.modifyCurrLevel(modifier),
          className: className,
        },
    )
  }

  setCurrLevel(level) {
    var fn = function() {
      this.setState(state => ({
        currLevel: level,
      }));
    }
    return fn.bind(this);
  }

  setCurrLevelComponent(className, level) {
    return React.createElement(
        'button',
        {
          onClick: this.setCurrLevel(level),
          className: className,
        },
    )
  }

  nameComponent() {
    return React.createElement(
        'span',
        {
          className: 'text-secondary skill-name',
        },
        this.state.skill.name,
    )
  }

  levelComponent() {
    const classNames = [
        'text-secondary',
        'skill-level',
        'float-right',
        'align-right',
    ];

    return React.createElement(
        'span',
        {
            className: classNames.join(' '),
        },
        this.state.currLevel + " / " + this.maxSkillLevel,
    )
  }

  render() {
    const classNames = [
      'skill',
    ];
    if (this.state.currLevel != this.minSkillLevel) {
      classNames.push('font-weight-bold');
    }
    return React.createElement(
        'div',
        {className: classNames.join(' ')},
        this.imageComponent(),
        this.nameComponent(),
        this.setCurrLevelComponent('dupArrow float-right', this.maxSkillLevel),
        this.arrowComponent('upArrow float-right', 1),
        this.arrowComponent('downArrow float-right', -1),
        this.setCurrLevelComponent('ddownArrow float-right', this.minSkillLevel),
        this.levelComponent(),
    );
  }
}

export {Skill, ClassSkills};
