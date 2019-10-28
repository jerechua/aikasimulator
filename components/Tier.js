'use strict';

import {Skill} from './Skill.js';

// Component that displays a group of skills by tier.
class Tier extends React.Component {
  constructor(props) {
    super(props);
  }

  tierBanner() {
    return React.createElement(
        'p',
        {className: 'text-center h3 text-primary'},
        "Tier " + this.props.tier,
    )
  }

  render() {
    const entries = [];
    this.props.skills.forEach(function(skill, index) {
        entries.push(React.createElement(
          Skill,
          {
               key: index,
               skill: skill,
               imageLocation: skill.gameClassName() + "/" + skill.id + ".jpg",
               characterLevel: this.props.characterLevel,
               updateGlobalUsedPoints: this.props.updateGlobalUsedPoints,
          }
        ));
    }.bind(this));

    return React.createElement(
        'div',
        {className: "tier col bg-light border border-primary"},
        this.tierBanner(),
        entries,
    );
  }
}

export {Tier};
