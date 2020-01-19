$(() => {
 var form = $('#form-calc');
 var btn = $('#btnSubmit');
 var biddersBox = $('#bidders');
 var biddersArr = [];
 form.validate();

 form.on('submit', (e) => {
  e.preventDefault();
  if (form.valid()) {
   addBidder()
  }
 });
 $('#calculateBtn').click(() => {
  calculate();
 });
 var dataList = localStorage.getItem('bid_list2');

 if (dataList != null) {
  var dataJson = JSON.parse(dataList);
  if (dataJson.length == 5) {
   $('#calculateBtn').show();
  } else {
   $('#calculateBtn').hide();
  }
 } else {
  $('#calculateBtn').hide();
 }
 showBidder()
});


function addBidder() {
 var bidValue = $('#bid').val();
 var nameValue = $('#name').val();
 var timeStamp = new Date().getTime();
 var objToAdd = {
  name: nameValue,
  bid: bidValue,
  timestamp: timeStamp,
 }
 $('#btnSubmit').prop('disabled', false)
 var dataList = localStorage.getItem('bid_list2');
 console.log(dataList);
 if (dataList != null) {

  var dataJson = JSON.parse(dataList);
  console.log('dataJson', dataJson);
  if (dataList.length >= 5) {
   dataJson.push({
    name: nameValue,
    bid: bidValue,
    timestamp: timeStamp,
   });
   localStorage.setItem('bid_list2', JSON.stringify(dataJson));
   if (dataJson.length == 5) {
    $('#calculateBtn').show();
   }
  } else {
   $('#btnSubmit').prop('disabled', true)
  }

 } else {
  var objToAdd = [{
   name: nameValue,
   bid: bidValue,
   timestamp: timeStamp,
  }];
  localStorage.setItem('bid_list2', JSON.stringify(objToAdd));

 }
 showBidder()
}

function showBidder() {

 var dataList = localStorage.getItem('bid_list2');
 if (dataList != null) {
  var dataJson = JSON.parse(dataList);
  console.log(dataJson);
  let formatedArray = dataJson.map((val) => {
   var theDate = new Date(val.timestamp * 1000);
   dateString = theDate.toGMTString();
   return `<li class="list-group-item">
            <b class="text-primary">Bid : ${val.bid}</b><br />
            <small>${val.name}</small>
            <small class="float-right">${val.timestamp}</small>
            </li>`
  });
  $('#bidders').html(formatedArray);
 } else {
  $('#listOfBids li').html('No bids yet');
 }
}

function clearAll() {
 localStorage.removeItem('bid_list2');
 window.location.reload()
}

function calculate() {
 var dataList = localStorage.getItem('bid_list2');

 if (dataList != null) {
  var dataJson = JSON.parse(dataList);
  if (dataJson.length == 5) {
   $('#calculateBtn').show();
   let counted = []

   let occ = dataJson.map((v) => {
    return {
     name: v.name,
     ts: v.timestamp,
     bid: v.bid,
     occ: dataJson.filter((obj) => obj.bid === v.bid).length
    }
   });
   let ascSort = occ.sort((a, b) => parseFloat(a.occ) - parseFloat(b.occ));
   console.log(ascSort);
   //get the values occurred only once 
   let occuredOnlyOnce = ascSort.filter((obj) => obj.occ === 1);
   console.log('occuredOnlyOnce', occuredOnlyOnce);
   if (occuredOnlyOnce.length != 0) {
    //sort asc order with respect to timestamp
    let uniqueValueBidFirst = occuredOnlyOnce.sort((a, b) => parseFloat(occuredOnlyOnce.timestamp) - parseFloat(occuredOnlyOnce.timestamp));
    console.log('Winner is ', uniqueValueBidFirst[0]);
    $('#winnerDiv').show();
    $('#winnerDiv h4').html('Winner is ' + uniqueValueBidFirst[0].name + ' with bid value '+uniqueValueBidFirst[0].bid);
   } else {
    //check if all the bids are repeated or same
    let occursAlltheTime = ascSort.filter((obj) => obj.occ === occ.length); // calculate if occurence have same length as bids
    if (occursAlltheTime.length != 0) {
     //sort to find out the least timestamp
     let ascOrderTimeStamp = occursAlltheTime.sort((a, b) => parseFloat(occursAlltheTime.timestamp) - parseFloat(occursAlltheTime.timestamp));
     console.log(ascOrderTimeStamp);
     console.log('Winner is ', ascOrderTimeStamp[0]);
     $('#winnerDiv').show();
     $('#winnerDiv h4').html('Winner is ' + ascOrderTimeStamp[0].name + ' with bid value '+ascOrderTimeStamp[0].bid);
    } else {
     const occuredTimesDistinct = new Set();
     const takeOnlyFirstValueWithoutDuplicate = ascSort.filter(val => {
      if (occuredTimesDistinct.has(val.bid)) {
       return false;
      }
      occuredTimesDistinct.add(val.bid);
      return true;
     });
     console.log('Winner is ', takeOnlyFirstValueWithoutDuplicate[0]);
     $('#winnerDiv').show();
     $('#winnerDiv h4').html('Winner is ' + takeOnlyFirstValueWithoutDuplicate[0].name + ' with bid value '+takeOnlyFirstValueWithoutDuplicate[0].bid);
     console.log(takeOnlyFirstValueWithoutDuplicate);
    }
   }
  } else {
   $('#calculateBtn').hide();
  }
 } else {
  $('#calculateBtn').hide();
 }
}
