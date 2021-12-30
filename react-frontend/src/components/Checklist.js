import React from "react"

class Checklist extends React.Component {
  constructor(props) {
    super(props);
    this.state = { checkedItems: [] };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const checkedItems = this.state.checkedItems;
    const value = event.target.value;
    let updatedItems;
    if (value == "any") {
      updatedItems = [];
    } else {
      if (checkedItems.includes(value))
        updatedItems = checkedItems.filter(e => e != value);
      else
        updatedItems = checkedItems.concat([value]);
    }
    this.setState({ checkedItems: updatedItems }, () =>
      this.props.onChange(this.props.id, this.state.checkedItems));
  }

  render() {
    return (
      <div id={this.props.id} className="checklist">
        <label>
          <input value="any" type="checkbox" checked={this.state.checkedItems.length == 0} onChange={this.handleChange} />
          Any
        </label>
        {this.props.itemNames.map(name =>
          <label key={name}>
            <input value={name} type="checkbox" onChange={this.handleChange}
              checked={this.state.checkedItems.includes(name)} />
            {this.props.labelFormat(name)}
          </label>
        )}
      </div>
    );
  }
}

export default Checklist;
