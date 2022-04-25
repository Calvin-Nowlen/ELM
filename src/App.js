import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import ReactDOM from "react-dom";

var _ticketList = [];

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={onGetData}>Get Data</button>
        <button onClick={onGetDataTest}>Throttle Limit</button>
      </header>
    </div>
  );
  
}

async function onGetData() {  
  const apiurl = "https://portalapi.elmutility.com";
  const config = {
    headers : {
        'content-type' : 'application/x-www-form-urlencoded'
    }
  };

  const SECRET = encodeURIComponent('YmNYdwPlBEW1sN64SncGK8MKmoNRXg5Mjn3eayLI7xA=');
  const CLIENT_ID = 'CODETEST2';
  const requestStr = `client_secret=${SECRET}&grant_type=client_credentials&client_id=${CLIENT_ID}`;

  // Authenticate
  axios.post(apiurl+"/token", requestStr, config)
  .then(res => {
    const token = res.data.access_token;
    console.log('token', token);
    // debugger;

    if (token.length === 0) {
      alert('authentication failed');
      return;
    }
    // If we get here, auth was successful. Go get ticket data.
    getTicketData(apiurl, token);
  })
  .catch(err => {
    console.error(err);
    alert('error authenticating');
    // debugger;
  })
}

function getTicketData(apiurl, accessToken) {  
  const config = {
    headers : {
      'content-type' : 'application/json',
      'authorization' : 'Bearer ' + accessToken
    }
  };

  const queryStr = "/api/ticketquery/getcustomertickets?startDateTimeUtc=2022-04-11T10:00:00&endDateTimeUtc=2022-04-11T18:00:00&queryType=CreationDate";
  axios.get(apiurl+queryStr, config)
  .then(res => {
    console.log(`Retrieved ${res.data.length} tickets`);
    alert(`Success. Retrieved ${res.data.length} tickets.`)
    // Use global for sample app expediency
    _ticketList = res.data;
    const myTable = table(_ticketList);
    //document.write(Object.keys(_ticketList[0]));

    ReactDOM.render(myTable, document.getElementById('root'));

    // debugger;
  })
  .catch(err => {
    console.error(err);    
    alert(err.message + ' ' + err.response.data);
  });

}

function table(list){
  var output = [];
  list.forEach(function(item) {
    var existing = output.filter(function(v,i) {
      return v.TicketNumber === item.TicketNumber && v.TicketVersion === item.TicketVersion;
    });
    if (existing.length) {
      var existingIndex = output.indexOf(existing[0]);
      output[existingIndex].MemberCode = output[existingIndex].MemberCode.concat(item.MemberCode);
    } else {
      if (typeof item.MemberCode == 'string')
        item.MemberCode = [item.MemberCode];
      output.push(item);
    }
  });
  return(
      <div>
        <table>
          <tr>
            <th>Number</th>
            <th>Ver</th>
            <th>Type</th>
            <th>Due Date</th>
            <th>Member Code</th>
          </tr>

          {output.map((val, key) => {
            const date = new Date(val.DueDateUtc)
            return (
                <tr key={key}>
                  <td>{val.TicketNumber}</td>
                  <td>{val.TicketVersion}</td>
                  <td>{val.TicketType}</td>
                  <td>{date.toString()}</td>
                  <td>{val.MemberCode.join(",")}</td>
                  <td>
                    <details>
                      <table>
                      <tr>
                        <th>Number:</th> <td>{val.TicketNumber}</td>
                      </tr>
                      <tr>
                        <th>Ver:</th> <td>{val.TicketVersion}</td>
                      </tr>
                      <tr>
                        <th>Type:</th> <td>{val.TicketType}</td>
                      </tr>
                      <tr>
                        <th>Due Date:</th> <td>{date.toString()}</td>
                      </tr>
                      <tr>
                        <th>Member Code:</th> <td>{val.MemberCode.join(",")}</td>
                      </tr>
                      <tr>
                        <th>Street Address:</th> <td>{val.StreetAddress}</td>
                      </tr>
                      <tr>
                        <th>City:</th> <td>{val.City}</td>
                      </tr>
                      <tr>
                        <th>State:</th> <td>{val.State}</td>
                      </tr>
                      <tr>
                        <th>XStreet Address:</th> <td>{val.XStreetAddress1}, {val.XStreetAddress2}</td>
                      </tr>
                      <tr>
                        <th>Work Location:</th> <td>{val.WorkLocation}</td>
                      </tr>
                      <tr>
                        <th>Contractor:</th> <td>{val.Contractor}</td>
                      </tr>
                      <tr>
                        <th>Contact:</th> <td>{val.Contact}</td>
                      </tr>
                      <tr>
                        <th>Phone:</th> <td>{val.Phone}</td>
                      </tr>
                      <tr>
                        <th>Work Type:</th><td>{val.WorkType}</td>
                      </tr>
                      </table>
                    </details>
                  </td>
                </tr>
            )
          })}
        </table>
        <a href="/">Return Home</a>
      </div>
  )
}


async function onGetDataTest() {
  const apiurl = "https://portalapi.elmutility.com";
  const config = {
    headers : {
      'content-type' : 'application/x-www-form-urlencoded'
    }
  };

  const SECRET = encodeURIComponent('YmNYdwPlBEW1sN64SncGK8MKmoNRXg5Mjn3eayLI7xA=');
  const CLIENT_ID = 'CODETEST2';
  const requestStr = `client_secret=${SECRET}&grant_type=client_credentials&client_id=${CLIENT_ID}`;

  // Authenticate
  axios.post(apiurl+"/token", requestStr, config)
      .then(res => {
        const token = res.data.access_token;
        console.log('token', token);
        // debugger;

        if (token.length === 0) {
          alert('authentication failed');
          return;
        }
        // If we get here, auth was successful. Go get ticket data.
        const total = testLimit(apiurl, token, 100,60000);
        total.then(value =>
            ReactDOM.render(throttleReport(value), document.getElementById("root"))
        )

        // ReactDOM.render(total, document.getElementById('lim'));

      })
      .catch(err => {
        console.error(err);
        alert('error authenticating');
        // debugger;
      })
}
function throttleReport(limit){
  return(
      <div>
        <h1>
          Max Queries Per Minute
        </h1>
        <p>
          The total number of queries permitted for your access to the endpoint each minute is: {limit} queries
        </p>
        <a href="/">Return Home</a>
      </div>
  )
}
async function testLimit(apiCall, accessToken, concurency, time) {
  const endTime = Date.now() + time;

  // launch "concurency" number of requests
  const clients = [];
  while(clients.length < concurency) {
    clients.push(clientQuery(apiCall, accessToken, endTime));
  }

  // sum the number of requests that succeded from each worker.
  // this implicitly waits for them to finish.
  let total = 0;
  for(const worker of clients) {
    total += await worker;
  }
  return total;
}

async function clientQuery(apiCall, accessToken, until) {
  let successfullRequests = 0;
  while(true) {
    const success = await APICall(apiCall, accessToken);
    // only count it if the request was successfull
    // AND finished within the timeframe
    if(success && Date.now() < until) {
      successfullRequests++;
    } else {
      break;
    }
  }
  return successfullRequests;
}

async function APICall(apiCall, accessToken) {
  const config = {
    headers : {
      'content-type' : 'application/json',
      'authorization' : 'Bearer ' + accessToken
    }
  };

  const queryStr = "/api/ticketquery/getcustomertickets?startDateTimeUtc=2022-04-11T10:00:00&endDateTimeUtc=2022-04-11T18:00:00&queryType=CreationDate";
  try {
    const resp = await fetch(apiCall+queryStr, config);
    return resp.ok;
  } catch {
    return false;
  }
}
export default App;
