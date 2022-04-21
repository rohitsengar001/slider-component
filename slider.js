const convertFrom24To12Format = (time24) => {
  const [sHours, minutes] = time24.match(/([0-9]{1,2}):([0-9]{2})/).slice(1);
  const period = +sHours < 12 ? "AM" : "PM";
  const hours = +sHours % 12 || 12;
  return `${hours}:${minutes} ${period}`;
};
function numberFormat(str) {
  let arr = Array.from(str);
  if (arr[0] != '0') {
    if (arr[1])
      return str;
    else if (!arr[1]) {
      return "0" + arr[0];
    } else {
      return arr[1] + "0"
    }
  }
  else if (arr[0] === '0') {
    if (arr[1]) return "0" + arr[1];

  }
  return '00'
}
function convertNumToTime(number) {
  // Check sign of given number
  var sign = (number >= 0) ? 1 : -1;

  // Set positive value of number of sign negative
  number = number * sign;

  // Separate the int from the decimal part
  var hour = Math.floor(number);
  var decpart = number - hour;

  var min = 1 / 60;
  // Round to nearest minute
  decpart = min * Math.round(decpart / min);

  var minute = Math.floor(decpart * 60) + '';

  // Add padding if need
  if (minute.length < 2) {
    minute = '0' + minute;
  }

  // Add Sign in final result
  sign = sign == 1 ? '' : '-';

  // Concate hours and minutes
  time = sign + hour + ':' + minute;

  return time;
}

function my_prettify(n) {
  let a = parseInt(n) / 100;
  let b = a.toString().split(".");
  // console.log(b[0], b[1]);
  let d = "00";
  if (b[1]) {
    if (b[1] < 50 && b[1] != 5) {
      d = "00";
    } else {
      d = "30";
    }
  }
  let c = b[0] + ":" + d + ":00";
  // console.log(c);
  return convertFrom24To12Format(c);
}
//slider1 logic
let interval = 250;
let globalInterval=250;
let timeOfShiftSecond;
let fromVal = 800;
let toVal = fromVal + interval;
let fromVal2 = 800;
let toVal2 = 1200;
var s1;
var s2;
let fire = true;
let prevub;
let prevlb;
$(document).ready(function () {
  $("#slider1").ionRangeSlider({
    skin: "round",
    type: "double",
    grid: true,
    grid_num: 26,
    min: 700,
    max: 2000,
    from: fromVal,
    to: toVal,
    to_max: 1600,
    step: 50,
    to_shadow: true,
    prettify: my_prettify,
    drag_interval: true,
    // from_fixed: true,
    // to_fixed: true ,
    // min_interval: 100,
    // max_interval: 300,
    onStart: function (data) {
      timeOfShiftOne = toVal - fromVal;
      console.log("onstart");
    },
    onChange: function (data) {
      timeOfShiftOne = data.to - data.from;
      prevlb = fromVal;
      // fromVal = data.from;
      prevub = toVal;
      // toVal = data.to;
      // console.log("=>" + prevlb, prevub);
    },
    onFinish: function (data) {
      console.log("onfinish");
      fire = true;
      toogleForBoundarySlider1();
      if ($("#dropdownShifts").val() == 2) {
        if (toVal != data.to) {
          toVal = data.to;
          if (true) {
            isGapMaintain() ? increaseOrDecreaseSlider2() : OnGapNotMaintain();
          }
        } else {
          fromVal = data.from;
          isGapMaintain() ? increaseOrDecreaseSlider2() : OnGapNotMaintain();
        }
      } else {
        //this secton running under the current changes occurred inside the control of first slider
        let changeValue; // stores the changes in value
        // fired on pointer release
        //while we got changes inside the upperbound
        //case 1: when interval change
        if (toVal != prevub && fromVal != prevlb) {
          console.log("interval changes");
        } else if (fromVal != prevlb) {
          //case 2: when lower-bound change
          console.log("fromval change");
          changeValue = fromVal - prevlb;
          if (fromVal <= 2000 - interval) {
            console.log("changeValue:", changeValue);
            (checkIntervalFirstSlide() != interval) ? s1.update({ to: toVal + changeValue, }) : null;

          } else {
            s1.update({
              from: prevlb,
              to: toVal,
            });
          }
        } else {
          // case 3: when upperbound change
          changeValue = toVal - prevub;
          console.log("toval change" + changeValue);
          if (data.to >= 700 + interval) {
            console.log(data.from + "," + data.to);
            console.log("case: from>1100");
            // toVal = data.to;
            s1.update({
              from: prevlb + changeValue,
            });
            console.log(data.from + "," + data.to);
          } else {
            s1.update({
              to: prevub,
              from: prevlb,
            });
          }
        }
      }
    },
    onUpdate: function (data) {
      console.log("udate form");
      if ($("#dropdownShifts").val() == 2) {
        fromVal = data.from;
        toVal = data.to;
        timeOfShiftOne = toVal - fromVal;
      } else {
        if (true) {
          fromVal = data.from;
          toVal = data.to;
          timeOfShiftOne = toVal - fromVal;
        }
      }
    },
  });
  s1 = $("#slider1").data("ionRangeSlider");
  //!slider 2
  $("#slider2").ionRangeSlider({
    skin: "round",
    type: "double",
    grid: true,
    grid_num: 26,
    min: 700,
    max: 2000,
    from: fromVal2,
    to: toVal2,
    step: 50,
    prettify: my_prettify,
    drag_interval: true,
    from_shadow: true,
    to_shadow: true,
    min_interval: 100,
    max_interval: 300,
    onStart: function (data) {
      timeOfShiftSecond = data.to - data.from;
      toogleForBoundarySlider1();
    },
    onChange: function (data) {
      // fromVal2= data.from;
      // toVal2= data.to;
    },
    onFinish: function (data) {
      // console.log('onFinish');
      timeOfShiftSecond = data.to - data.from;
      // fired on pointer release
      //for change in upperbound of slider2
      if (toVal2 != data.to) {
        toVal2 = data.to;
        console.log("(" + fromVal + "-" + extendableTime() + ")");
        //check if first slider lowerbound is smaller than 700 after add extendableTime
        //extendableTime: whether it's postive or negative
        //then update upperbound of slider1 if space is not available besides lowerbound
        if (fromVal - extendableTime() < 700) {
          fromVal = 700;
          s1.update({
            to: toVal + extendableTime(),
          });
        } else {
          fromVal = fromVal - extendableTime();
          s1.update({
            from: fromVal,
          });
        }
      } else {
        //change in lowerbound slider2
        fromVal2 = data.from;
        if (fromVal - extendableTime() < 700) {
          s1.update({
            to: toVal + extendableTime(),
          });
        } else {
          fromVal = fromVal - extendableTime();
          s1.update({
            from: fromVal,
          });
        }
      }
    },
    onUpdate: function (data) {
      timeOfShiftSecond = data.to - data.from;
    },
  });
  s2 = $("#slider2").data("ionRangeSlider");
});
function updateSlider(intervalVal) {
  console.log("updateSlider 1");
  $("#wizardErr").html("");
  $("#slider1Cont").show();
  fromVal = 800;
  toVal = fromVal + intervalVal;
  s1.update({
    from: fromVal,
    to: toVal,
  });
  timeOfShiftOne = toVal - fromVal;
}
function updateSlider2() {
  $("#wizardErr").html("");
  // console.log("SLIDER 2");
  // console.log("Interval: "+(interval*2)+":"+gap);
  fromVal2 = toVal +200;
  toVal2 = fromVal2 +interval*2- checkIntervalFirstSlide();
  s2.update({
    from: fromVal2,//2 hrs gap
    to: toVal2,
    from_min: toVal + 200,
    from_max: 2000,
  });
  timeOfShiftSecond = toVal2 - fromVal2;
}
//while Shift value change then
$("#dropdownShifts").on("change", function () {
  if ($("#dropdownShifts").val() == 2) {
    // Interval Change 2
    interval = interval / 2;
    $("#slider2").parent().show();
    
    //update the slider1 incordance their interval
    updateSlider(interval);

    //roundup the upperbound of slider1 
    //update the roundup value in slider1
    s1.update({to:roundOffCeiling(toVal)});
    
    //update slider2
    updateSlider2();
  } else {
    // Interval Change 3
    interval = interval * 2;
    updateSlider(interval);
    $("#slider2").parent().hide();
  }
});

// @return(): boolean
function isExtendableShift() {
  let AccumulationShiftTime = timeOfShiftOne + timeOfShiftSecond;
  console.log(AccumulationShiftTime >= 2 * interval ? false : true);
  return AccumulationShiftTime >= 2 * interval ? false : true;
}

// check extendableTime if it's availabe or not whether it's availabe in first or secornd slide
// @return :number(extendable time)
function extendableTime() {
  console.log(2 * interval, timeOfShiftOne, timeOfShiftSecond);
  console.log(2 * interval - (timeOfShiftOne + timeOfShiftSecond));
  return 2 * interval - (timeOfShiftOne + timeOfShiftSecond);
}

//check interval time b/w first slide and second slide
function checkInterval() {
  return fromVal2 - toVal - 200;
}

//* @return: boolean
function isGapMaintain() {
  return fromVal2 - toVal >= 200;
}

//increase tha gap b/w first and second slide
//if gap is not maintain then increase the gap b/w slides
function OnGapNotMaintain() {
  // console.log("onGapNotMaintain");
  //initially increase both bounds of slider2 by 2hrs from slider1
  fromVal2 = toVal + 200;
  toVal2 = fromVal2 + 200;
  //perform updation inside range of slider
  s2.update({
    from: fromVal2,
    to: toVal2,
    from_min: fromVal2,
  });
  if (true) {
    s2.update({
      to: toVal2 + extendableTime(),
    });
  }
}

//while changing pefrom in slider1
function increaseOrDecreaseSlider2() {
  console.log("increaseOrDecreaseSlider2");
  fromVal2 -= fromVal2 - toVal - 200;
  toVal2 = fromVal2 + 200;
  s2.update({
    from: fromVal2,
    to: toVal2,
    from_min: fromVal2,
    from_max: 2000,
  });
  if (true) {
    s2.update({
      to: toVal2 + extendableTime(),
    });
  }
}
//for testing purpose
function showAllCordinates() {
  console.log("(", fromVal + "," + toVal + "," + fromVal2 + "," + toVal2 + ")");
}

// changes boundary interval inaccordance their shifts
function toogleForBoundarySlider1() {
  if ($("#dropdownShifts").val() == 2) {
    s1.update({
      to_max: 1600,
      max_interval: 300,
    });
  } else {
    s1.update({
      to_max: 2000,
      // max_interval: 400,
    });
  }
}
//make for testing purpose only
function checkIntervalFirstSlide() {
  console.log(toVal - fromVal);
  return toVal - fromVal;
}

function numberNewFormat(str) {
  let arr = Array.from(str);
  if (arr[0] != '0') {
    if (arr[1])
      return str;
    else if (!arr[1]) {
      return arr[0] + '0';
    } else {
      return arr[1] + "0"
    }
  }
  else if (arr[0] === '0') {
    if (arr[1]) return "0" + arr[1];

  }
  return '00'
}
// console.log(numberFormat("1"))
function roundOffCeiling(num) {
  let decimalTime, values;
  let res;
  //take upperbound of first slide
  decimalTime = num / 100;

  //make string array by bifurcating the  integer value and decimal value
  values = decimalTime.toString().split(".");
  // check for round off &update decimal time
  //handle the case of undefined in values[1]
  if (values[1]) {
    if (+numberNewFormat(values[1]) + 50 >= 100) {
      res = values[0] * 100 + 100;
    } else {
      if (+numberNewFormat(values[1]) >= 25)
        res = values[0] * 100 + 50;
      else
        res = values[0] * 100;
    }
  } else {
    res = toVal;
  }
  console.log(res);
  return res;
}

