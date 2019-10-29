'use strict';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSelectedClass: this.props.currentSelectedClass,
      currentSelectedLevel: this.props.currentSelectedLevel,
      remainingPoints: this.props.remainingPoints,
    }

    this.classMap = this.props.classMap;
    this.updateGameClassName = this.props.updateGameClassName;
    this.updateCharacterLevel = this.props.updateCharacterLevel;

    this.displayNames = [];
    for (var k in this.classMap) {
      this.displayNames.push(k);
    }
    this.displayNames.sort();

    this.dropdownEntry = this.dropdownEntry.bind(this);
    this.levelSelectorOnChange = this.levelSelectorOnChange.bind(this);
  }

  shouldComponentUpdate(np, ns) {
    if (np.remainingPoints != this.state.remainingPoints) {
      this.setState({
        remainingPoints: np.remainingPoints,
      });
    }
    return true;
  }

  // TODO: Dropdown should be its own class.
  dropdownButton(contents) {
    return React.createElement(
        'button',
        {
          className: [
              'btn',
              'btn-primary',
              'dropdown-toggle',
          ].join(' '),
          'data-toggle': 'dropdown',
        },
        contents,
    );
  }

  dropdownEntry(contents, onClick, extraClassName) {
    return React.createElement(
        'a',
        {
          key: contents,
          className: ['dropdown-item'].concat(extraClassName).join(' '),
          onClick: onClick,
        },
        contents,
    );
  }

  dropdownEntries(entries) {
    return React.createElement(
        'div',
        {className: 'dropdown-menu overflow-auto level-selector-dropdown'},
        entries,
    );
  }

  // TODO: Game class selector should be its own component.
  classesDropdownEntries() {
    var entries = []
    this.displayNames.forEach(function(entry) {
      var onClick = function() {
        this.updateGameClassName(entry);
        this.setState(state => ({
          currentSelectedClass: entry
        }));
      }.bind(this);

      entries.push(this.dropdownEntry(this.classMap[entry], onClick, ['classname-entry']));
    }.bind(this))

    return this.dropdownEntries(entries);
  }

  classSelectorElement() {
    return React.createElement(
        'div',
        {
          className: 'dropdown setting-entry',
        },
        this.dropdownButton(this.classMap[this.state.currentSelectedClass]),
        this.classesDropdownEntries(),
    );
  }

  levelSelectorOnChange(evt) {
    this.setState({currentSelectedLevel: evt.target.value});
    this.updateCharacterLevel(evt.target.value);
  }

  // TODO: Level selector should be its own components.
  levelSelectorElement() {
    const levels = [];
    for (var i = 1; i <= 99; i++) {
      var opts = {key: i, value: i};
      levels.push(React.createElement(
          'option',
          opts,
          i,
      ));
    }

    const levelSelector = React.createElement(
        'div',
        {className: 'input-group-prepend'},
        React.createElement(
          'label',
          {className: 'input-group-text'},
          'Level'
        ),
        React.createElement(
            'select',
            {
              className: 'custom-select',
              id: 'level-selector',
              onChange: this.levelSelectorOnChange,
              value: this.state.currentSelectedLevel,
            },
            levels,
        )
    );

    return React.createElement(
        'div',
        {className: 'input-group setting-entry'},
        levelSelector,
     );
  }

  pointsRemainingElement() {

    const remainingPointsClass = ['input-group-text'];
    const actualPointsClass = ['form-control'];

    if (this.state.remainingPoints == 0) {
      remainingPointsClass.push('bg-danger', 'text-white');
      actualPointsClass.push('font-weight-bold');
    }

    const label = React.createElement(
        'div',
        {className: 'input-group-prepend'},
        React.createElement(
          'label',
          {className: remainingPointsClass.join(' ')},
          'Remaining Points'
        ),
        React.createElement(
            'span',
            {
              className: actualPointsClass.join(' '),

            },
            this.state.remainingPoints,
        )
    );
    return React.createElement(
        'div',
        {className: 'input-group setting-entry'},
        label,
    )
  }

  render() {
    const row = React.createElement(
        'div',
        {
          className: 'row',
        },
        this.classSelectorElement(),
        this.levelSelectorElement(),
        this.pointsRemainingElement(),
    )
    return React.createElement(
        'div',
        {
          className: 'container-fluid',
        },
        row,
    );
  }
}

export {Settings};
