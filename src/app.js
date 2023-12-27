function parsePayload(payload) {
    let hex_bytes = new Uint8Array(atob(payload).match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    let fields = ['header', 'data_id', 'time', 'bin_id', 'event_id', 'data', 'crc', 'footer'];
    let lengths = [2, 3, 4, 6, 1, 13, 2, 1];

    let turn_data = {}, start = 0;
    fields.forEach((field, i) => {
        turn_data[field] = String.fromCharCode.apply(null, hex_bytes.slice(start, start + lengths[i])); 
        start += lengths[i];
    });

    return turn_data;
}

var payload;
var latest = "https://lh1fo7oomg.execute-api.us-east-1.amazonaws.com/test/home";
var global = "https://lh1fo7oomg.execute-api.us-east-1.amazonaws.com/test/global";


function fetchy(){
    fetch(latest)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    payload = data.M.PayloadData.S;
    sequence = data.M.Seq.N;
    var result = parsePayload(payload);
    var data = result.data;


    if (/^[\u0000]+$/.test(data)) {
        document.getElementById("heading").innerText = "Waiting For Scan"; 
        document.getElementById("output-box-1").innerText = "";
    } else if (data[0] === '|') {
        document.getElementById("heading").innerText = "PHONE ID";
        document.getElementById("output-box-1").innerText = data;
    } else if (data[0] === '0') {
        document.getElementById("heading").innerText = "CUP ID";
        document.getElementById("output-box-1").innerText = data;
    } else if (data[0] === '4') {
        document.getElementById("heading").innerText = "TAG ID";
        document.getElementById("output-box-1").innerText = data;
    } else {
        document.getElementById("heading").innerText = "Default Heading";
        document.getElementById("output-box-1").innerText = data;
    }
    
    
  })
  .catch(error => {
    console.error("Fetch error:", error);
  });
}

setInterval(fetchy, 500);

