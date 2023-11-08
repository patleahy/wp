// Get the store items from the server API and render them.
// We get all the items in one API call. Section filtering is then done here in the client code.
//
// Pat Leahy pat@patleahy.com
class Store extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sections: {},  // The list of sections which items can belong to.
      items:  [],    // All the items.
      selected: ''   // The currently selected section.
    };
  }

  componentDidMount() {

    // The currently selected section will be in the URL hash.
    var selected = location.hash;
    if (selected != "") {
      // Strip off the '#' char.
      selected = selected.substr(1);
    }

    // Load all the items.
    $.get('/api/store', results => {
      results['selected'] = selected;
      this.setState(results);
    });
  }

  render() {
    var that = this;

    // state is null before anything is loaded.
    if (this.state.items.length == 0) {
      return (<p><i className="fa fa-circle-o-notch fa-spin"/> Loading...</p>);
    }

    // Show the list of sections with the selected one active.
    var selected = this.state.selected;

    var sections = [
      <a className={"btn " + (selected == "" ? "active" : "inactive")} href={"#"} onClick={that.linkClicked.bind(that, "")}>{"All"}</a>
    ];

    this.state.sections.forEach((section) => {
      sections.push(
          <a className={"btn " + (selected == section ? "active" : "inactive")} href={"#" + section} onClick={that.linkClicked.bind(that, section)}>{section}</a>
      );
    });

    // Get the items for the selected section.
    var active_items = [];
    if (selected == "") {
      active_items = this.state.items;
    } else {
      this.state.items.forEach(function(item) {
        if (item.section == selected) {
          active_items.push(item);
        }
      });
    }

    // Show the items in 4 columns.
    var rows = core.array_chunk(active_items, 4);

    // Render the items.
    // We will convert the Etsy IDs to hex to show a short identifier for each item which people can refer to.
    return (
      <div className="container-fluid">
        <div className="sections">{sections}</div>
        <div className="items">
          {
            rows.map(row =>
              <div className="row">
                {
                  row.map(item =>
                    <div className="col-sm-3">
                      <a href={item.url} target="etsy">
                        <img src={item.small_img} />
                        <p>{core.unescape(item.title)}<br/>$ {item.price}<br/>id: {item.id.toString(16)}</p>
                      </a>
                    </div>
                  )
                }
              </div>
            )
        }
        </div>
      </div>
    );
  }

  // When a section is clicked get the selected name from the hash in the linked clicked on
  // and then re-render this control.
  linkClicked(selected, event) {
    this.state.selected = selected;
    window.location.hash = selected;
    this.setState(this.state);
  }
}