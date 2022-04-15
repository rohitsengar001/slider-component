const convertFrom24To12Format = (time24) => {
  const [sHours, minutes] = time24.match(/([0-9]{1,2}):([0-9]{1,2})/).slice(1);
  const period = +sHours < 12 ? "AM" : "PM";
  // const hours = +sHours % 12 || 12;
  hours = +sHours > 12 ? +sHours% 12 : +sHours;
  console.log("convert=>"+`${hours}:${minutes} ${period}`);
  return `${hours}:${minutes} ${period}`;
};
function numberFormat(str){
  let arr =Array.from(str);
  if(arr[0] != '0'){
      if(arr[1] )
         return str;
      else if(!arr[1]) {
          return "0"+arr[0];
      }else{
          return arr[1]+"0"
      }         
  } 
  else if(arr[0] === '0'){
      if(arr[1]) return arr[1];
  }
  return '00'
}
function my_prettify(n) {
  console.log("value of n:",n);
  let a = parseInt(n) / 100;
  let b = a.toString().split(".");
  // console.log(b[0], b[1]);
  let d = "00";
  let flag = false;
  if (b[1]) {
    flag = true;
    if (+numberFormat(b[1]) > 60 && b[1]) {
      let hrs = 1;
      let min = (+b[1] % 60)/100
      b[0] = String((+b[0]) + hrs);
      //manage digits in minutes
      d = numberFormat(min);
      // d=(min);
    } else {
      d = b[1];
    }
  }
  let c = b[0] + ":" + d + ":00";
  console.log("=>", c+","+d);
  return convertFrom24To12Format(c);
}
//slider1 logic
let interval = 400;
let timeOfShiftOne;
let timeOfShiftSecond;
let fromVal = 800;
let toVal = 1200;
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
    step: 1,
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
          if (fromVal <= 1600) {
            s1.update({
              to: toVal + changeValue,
            });
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
          if (data.to >= 1100) {
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
    step: 1,
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
function updateSlider() {
  // console.log("SLIDER 1");
  $("#wizardErr").html("");
  $("#slider1Cont").show();
  fromVal = 800;
  toVal = fromVal + interval;
  s1.update({
    from: fromVal,
    to: toVal,
  });
  timeOfShiftOne = toVal - fromVal;
}
function updateSlider2(gap) {
  $("#wizardErr").html("");
  // console.log("SLIDER 2");
  // console.log("Interval: "+(interval*2)+":"+gap);
  fromVal2 = toVal;
  toVal2 = fromVal2 + (interval * 2 - gap);
  s2.update({
    from: fromVal2 + 200, //2 hrs gap
    to: toVal2 + 200,
    from_min: toVal + 200,
    from_max: 2000,
  });
  timeOfShiftSecond = toVal2 - fromVal2;
  fromVal2 += 200;
  toVal2 += 200;
  toogleForBoundarySlider1();
}
//on Shift=2
$("#dropdownShifts").on("change", function () {
  if ($("#dropdownShifts").val() == 2) {
    // Interval Change 2
    interval = interval / 2;
    $("#slider2").parent().show();
  } else {
    // Interval Change 3
    interval = interval * 2;
    $("#slider2").parent().hide();
  }
  updateSlider();
  updateSlider2(interval);
});

// @return(): boolean
function isExtendableShift() {
  let AccumulationShiftTime = timeOfShiftOne + timeOfShiftSecond;
  console.log(AccumulationShiftTime >= 400 ? false : true);
  return AccumulationShiftTime >= 400 ? false : true;
}

// check extendableTime if it's availabe or not whether it's availabe in first or secornd slide
// @return :number(extendable time)
function extendableTime() {
  console.log(400 - (timeOfShiftOne + timeOfShiftSecond));
  return 400 - (timeOfShiftOne + timeOfShiftSecond);
}

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
      min_interval: 100,
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
