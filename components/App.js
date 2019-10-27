'use strict';

import {Cleric} from '../SkillData/Cleric.js';
import {ClassSkills} from './Skill.js';
import {Tier} from './Tier.js';

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
    })

    const cols = React.createElement('div', {className: 'row'}, tierComps);
    return React.createElement('div', {className: 'container main-container'}, cols);
  }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(
  React.createElement(App, {clericData: Cleric}),
  domContainer
 );
