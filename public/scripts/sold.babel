// Get the sold items from the server API and render them.
// The user must be authenticated with the Etsy API to be able to use call the sold API. 
// This will redirect to an authentication page if the API call fails.
//
// Pat Leahy pat@patleahy.com

class Sold extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items:  []
    };
  }

  componentDidMount() {
    // Load the sold items.
    $.get('/api/sold', results => {
      if (results['status'] && results['status'] == 'error') {
        // The user probably has to autheiticate with Etsy.
	      // Redirect to the authentication page.
        window.location = '/sold?reauth=1';
        return;
      }

      this.setState(results);
    });
  }

  render() {
    var that = this;

    // state is null before anything is loaded.
    if (this.state.items.length == 0) {
      return (<p><i className="fa fa-circle-o-notch fa-spin"/> Loading...</p>);
    }

    // Show the items in 4 columns.
    var rows = core.array_chunk(this.state.items, 4);

    // Render the items.
    // We will convert the Etsy IDs to hex to show a short identifier for each item which people can refer to.
    return (
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
    );
  }
}