<!DOCTYPE html>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>slider</title>
    <!--Plugin CSS file with desired skin-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ion-rangeslider/2.3.1/css/ion.rangeSlider.min.css" />

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ion-rangeslider/2.3.1/js/ion.rangeSlider.min.js"></script>
</head>

<body>
    <div class="container">
        <div class="row mx-auto">
            <div class="col">
                <div id="slider1Cont" style="display:block;">
                    <div class="inputs-container">
                        <h6>Please Select Number of Work-shifts Per Day</h6>
                        <ul class="row">
                            <li class="col-sm-6">
                                <span class="select">
                                    <select class="dropdownSelect" id="dropdownShifts">
                                        <option value="0" disabled="">No. of Shifts</option>
                                        <option value="1" selected="">1 Shift</option>
                                        <option value="2">2 Shifts</option>
                                    </select>
                                </span>
                            </li>
                            <li class="col-sm-6 mb-4">
                                <div>
                                    <input type="text" id="slider1">
                                </div>
                                <div class="mt-4" style="display: none ;">
                                    <input type="text" id="slider2">
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <button type="button" class="btn btn-primary" onclick="isExtendableShift()">IsExtendableShift</button>
    <button type="button" class="btn btn-primary"onclick="extendableTime()">ExtendableTime</button>
    <!--Plugin JavaScript file-->
    <script src="./slider.js"></script>
</body>

</html>
<?php
?>