'use strict';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.currentSelectedClass = this.props.currentSelectedClass;
    this.classMap = this.props.classMap;
    this.updateGameClassName = this.props.updateGameClassName;

    this.displayNames = [];
    for (var k in this.classMap) {
      this.displayNames.push(k);
    }
    this.displayNames.sort();


    this.dropdownEntry = this.dropdownEntry.bind(this);
  }

  dropdownButton() {
    return React.createElement(
        'button',
        {
          className: [
              'btn',
              'btn-secondary',
              'dropdown-toggle',
          ].join(' '),
          'data-toggle': 'dropdown',
        },
        this.classMap[this.currentSelectedClass],
    );
  }

  dropdownEntry(contents) {
    return React.createElement(
        'a',
        {
          key: contents,
          className: 'dropdown-item classname-entry',
        },
        contents,
    );

  }

  dropdownEntries() {
    var entries = []
    var dropdownEntry = this.dropdownEntry.bind(this);
    this.displayNames.forEach(function(entry) {
      entries.push(dropdownEntry(entry));
    })
    return React.createElement(
        'div',
        {className: 'dropdown-menu'},
        entries,
    );
  }

  render() {
    return React.createElement(
        'div',
        {
          className: 'dropdown',
        },
        this.dropdownButton(),
        this.dropdownEntries(),
    );
  }
}

export {Settings};
