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
    // Just an easy approximation of "first" skill needs to be min value of 1.
    // e.g. countdown on rifleman needs to be 1.
    if (this.dataPerLevel[0].level == 1) {
      return 1;
    }
    return 0;
  }

  // The maximum level for this skill.
  maxLevel() {
    return this.dataPerLevel.length;
  }

  // The level at which the character needs to be in order to apply this skill.
  minCharacterLevel() {
    return this.dataPerLevel[0].level;
  }

  // The maximum number of points that can be added to this skill for a given
  // level.
  maxPointsForLevel(level) {
    for (var i = this.dataPerLevel.length - 1; i >= 0; i--) {
      if (level >= this.dataPerLevel[i].level) {
        return i + 1;
      }
    }
    return 0
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
      // The location in GameClassName/imageIndex.jpg
      imageLocation: this.props.imageLocation,
    };

    this.minSkillLevel = this.props.skill.minLevel();
    this.maxSkillLevel = this.props.skill.maxPointsForLevel(
        this.props.characterLevel);
  }

  shouldComponentUpdate(np, ns) {
    // Use image location as the determining factor instead of the game class
    // name when a component needs to rerender since it's unique to the skill.
    if (np.imageLocation != this.state.imageLocation) {
      this.setState(state => ({
        skill: np.skill,
        // Make sure we reset current skill level back to initial state.
        currLevel: np.skill.minLevel(),
        imageLocation: np.imageLocation,
      }));
      // Class updating resets everything from the parent component, so just
      // short circuit;
      return true;
    } else if (np.characterLevel < this.props.characterLevel) {
      // The current selected level changed, so just update the current
      // level up to max allowable setting.
      //
      // The character level is going down, so we just set skill back to min
      // since there might not be enough points to do everything.
      //
      // TODO: Maybe this can be revisted to be smarter.
      this.setState({
        currLevel: np.skill.minLevel(),
      });
    }

    // Update the parent component with changess to skills.
    if (ns.currLevel != this.state.currLevel) {
      this.props.updateGlobalUsedPoints(ns.currLevel-this.state.currLevel);
    }

    return true;
  }

  imageComponent() {
    return React.createElement(
        'img', {src: this.state.imageLocation});
  }

  _setNewLevel(level) {
    const diff = level - this.state.currLevel;
    if (this.props.remainingPoints < diff) {
      // We're trying to level up when there's no more remaining points
      // available. We will only allow it if they're using the double up
      // arrow to max out, unless there's no more points.
      //
      // e.g. 3 remaining points of a skill that's 0/10. We will give them
      // the 3 remaining points instead of the 10 requested.
      if (this.props.remainingPoints == 0) {
        return;
      }
      level = this.state.currLevel + this.props.remainingPoints;
    }
    this.setState(state => ({
      currLevel: level,
    }));
  }

  modifyCurrLevel(modifier) {
    var fn = function () {
      var currLevel = this.state.currLevel + modifier;
      currLevel = Math.max(this.minSkillLevel, currLevel);
      currLevel = Math.min(this.maxSkillLevel, currLevel);
      this._setNewLevel(currLevel);
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
      this._setNewLevel(level);
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
          className: 'skill-name',
        },
        this.state.skill.name,
    )
  }

  levelComponent() {
    const classNames = [
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
    this.minSkillLevel = this.props.skill.minLevel();
    this.maxSkillLevel = this.props.skill.maxPointsForLevel(this.props.characterLevel);

    const classNames = [
      'skill',
    ];
    if (this.state.currLevel != this.minSkillLevel) {
      classNames.push('font-weight-bold');
    }
    if (this.props.characterLevel < this.state.skill.minCharacterLevel()) {
      classNames.push('disabled-skill');
    }
    if (this.state.currLevel != 0 && this.state.currLevel == this.maxSkillLevel) {
      classNames.push('bg-success text-white');
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
