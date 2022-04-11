console.log("slider.js");
let isApplied = false;
let isSurveyed = false;
let offer = "";
let sStartDate = "";
var dataMain = {};
let dynamicPrice = 0;
let dynamicMinutes = 0;
const convertFrom24To12Format = (time24) => {
  const [sHours, minutes] = time24.match(/([0-9]{1,2}):([0-9]{2})/).slice(1);
  const period = +sHours < 12 ? "AM" : "PM";
  const hours = +sHours % 12 || 12;
  return `${hours}:${minutes} ${period}`;
};
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
$(document).ready(function () {
  $("#slider1").ionRangeSlider({
    skin: "round",
    type: "double",
    grid: false,
    grid_num: 26,
    min: 700,
    max: 2000,
    from: fromVal,
    to: toVal,
    step: 50,
    prettify: my_prettify,
    drag_interval: true,
    // from_fixed: true,
    // to_fixed: true ,
    min_interval: 100,
    max_interval: interval - 100,
    onStart: function (data) {
      // console.log("DATA:" + JSON.stringify(data));
      timeOfShiftOne = toVal - fromVal;
    },
    onChange: function (data) {
      timeOfShiftOne = data.to - data.from;
    },
    onFinish: function (data) {
      fire = true;
        if ($("#dropdownShifts").val() == 2) {
          if (toVal != data.to) {
            toVal = data.to;
            // console.log("extendable time:", isExtendableShift());
            if (true) {
              s2.update({
                to: toVal2+extendableTime(),
              });
            }
          } else {
            fromVal = data.from;
            if (true) {
              s2.update({
                to: toVal2 + extendableTime(),
              });
            }
          }
        } else {
          // fired on pointer release
          //while we got changes to the value of upperbound
          if (toVal != data.to && data.to >= 1100) {
            console.log(data.to, fromVal + ",ifpart");
            toVal = data.to;
            s1.update({
              from: data.to - interval,
            });
          } else {
            console.log("else part");
            if (data.from <= 1600) {
              fromVal = data.from;
              s1.update({
                to: data.from + interval,
              });
            } else {
              s1.update({
                from: 1600,
              });
            }
          }
        }
    },
    onUpdate: function (data) {},
  });
  s1 = $("#slider1").data("ionRangeSlider");
  // console.log("s1:"+JSON.stringify(s1));
  //!slider 2
  $("#slider2").ionRangeSlider({
    skin: "round",
    type: "double",
    grid: false,
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
    },
    onChange: function (data) {
      timeOfShiftSecond = data.to - data.from;
    },
    onFinish: function (data) {
      // console.log('onFinish');
      // fired on pointer release
      if (toVal2 != data.to) {
        toVal2 = data.to;
        s2.update({
          from: data.to - interval,
        });
      } else {
        fromVal2 = data.from;
        s2.update({
          to: data.from + interval,
        });
      }
      fire = false;
      // toVal = (toVal-(data.to-data.from));
      toVal = fromVal2 - 100;
    },
    onUpdate: function (data) {
      // console.log(slotdp);
    },
  });
  s2 = $("#slider2").data("ionRangeSlider");
  // $('#tooltip').tooltip();
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
  // console.log("Split Interval",interval);
});
function isExtendableShift() {
  let AccumulationShiftTime = timeOfShiftOne + timeOfShiftSecond;
  console.log(timeOfShiftOne, timeOfShiftSecond);
  console.log(AccumulationShiftTime >= 400 ? false : true);
  return AccumulationShiftTime >= 400 ? false : true;
}
function extendableTime() {
  console.log(timeOfShiftOne, timeOfShiftSecond);
  console.log((RemainingTime = 400 - (timeOfShiftOne + timeOfShiftSecond)));
  return 400 - (timeOfShiftOne + timeOfShiftSecond);
}
//time Interval
function checkInterval() {
  return fromVal2 - toVal - 200;
}