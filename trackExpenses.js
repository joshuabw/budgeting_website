$(document).ready(function() {

    $("#add").click(function() {
        var lastField = $("#buildyourform div:last");
        var intId = (lastField && lastField.length && lastField.data("idx") + 1) || 1;
        var fieldWrapper = $("<div class=\"fieldwrapper\" id=\"field" + intId + "\"/>");
        fieldWrapper.data("idx", intId);

        //expense input fields
        var fDesc = $("<font size=\"3\" class=\"fieldDescription\" >Expense Type</font>");
        var fName = $("<input type=\"text\" class=\"fieldname\" />");
        var fDesc2 = $("<font size=\"3\" class=\"fieldDescription\" >Cost</font>");
        var fValue = $("<input type=\"number\" class=\"fieldcost\" />");
        //var fType = $("<select class=\"fieldtype\"><option value=\"checkbox\">Checked</option><option value=\"textbox\">Text</option><option value=\"textarea\">Paragraph</option></select>");
        var removeButton = $("<input type=\"button\" class=\"remove\" value=\"-\" />");
        removeButton.click(function() {
            $(this).parent().remove();
        });

        //append to page container
        fieldWrapper.append(removeButton);
        fieldWrapper.append(fDesc);
        fieldWrapper.append(fName);
        //fieldWrapper.append(fType);
        fieldWrapper.append(fDesc2);
        fieldWrapper.append(fValue);
        $("#buildyourform").append(fieldWrapper);
    });

    //global variable to hold expense values
    var expenses;
    var budget = 250;

    $("#display").click(function() {
        //reset piechart and array before every display
        $("#piechart").empty();
        expenses = [['Charges', 'Percent of Budget']];
        //var fieldSet = $("<fieldset id=\"yourform\"><legend>Your Form</legend></fieldset>");
        var totalSpent = 0;
        $("#buildyourform div").each(function() {
            //var id = "input" + $(this).attr("id").replace("field","");
            //var label = $("<label for=\"" + id + "\">" + $(this).find("input.fieldname").first().val() + "</label>");

            //retrieve every expense value pair and add to array
            var curExpense = [$(this).find("input.fieldname").first().val(), parseInt($(this).find("input.fieldcost").first().val())];
            expenses.push(curExpense);

            totalSpent += parseInt($(this).find("input.fieldcost").first().val());
        });
        var remain = budget - totalSpent;
        expenses.push(['Remaining', remain]);
        displayWeeklyBudgetValues(budget, remain);

        // Load google charts from expense array
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);

        document.getElementById('file').disabled = true;
    });

    //if a file is uploaded, this method is triggered
    document.getElementById('file').onchange = function(){
      var fileDisplayArea = document.getElementById('fileDisplayArea');
      var fileInput = document.getElementById('file');

      var file = this.files[0];
      var textType = /text.plain/; //.* means everything so changed to .plain
      //console.log(file.type);

      if (file.type.match(textType)) {
        var reader = new FileReader();
        $("#piechart").empty();
        expenses = [['Charges', 'Percent of Budget']];

        reader.onload = function(progressEvent){
          // Entire file console.log(this.result);
          var totalSpent = 0;
          // By lines
          var lines = this.result.split('\n');
          for(var line = 0; line < lines.length; line++){
            var data = lines[line];

            if(data !== null && data !== '') {
              var category_price = data.split(' ');

              var price = parseInt(category_price[1]);
              category_price[1] = price;
              expenses.push(category_price);
              totalSpent += price;
            }
          }
          var remain = budget - totalSpent;
          expenses.push(['Remaining', remain]);

          displayWeeklyBudgetValues(budget, remain);
        };
        reader.readAsText(file);

        // Load google charts
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);

        fileInput.disabled = true;
        fileDisplayArea.innerText = "";
      } else {
        fileDisplayArea.innerText = "File not supported!";
      }
    };

    // Draw the chart and set the chart values
    function drawChart() {
      var data = google.visualization.arrayToDataTable(expenses);/*[
        ['Charges', 'Percent of Budget'],
        ['Rent', 25],
        ['Food', 15],
        ['Gas', 5],
        ['Phone Bill', 5],
        ['Electric', 5],
        ['Remaining', 45]
      ] */

      // Optional; add a title and set the width and height of the chart
      var options = {'title':'Your Budget Summary', 'width':625, 'height':350, is3D: true};

      // Display the chart inside the <div> element with id="piechart"
      var chart = new google.visualization.PieChart(document.getElementById('piechart'));
      chart.draw(data, options);
    }

    //weekly bar chart load and draw methods
    google.charts.load('current', {'packages':['bar']});
    google.charts.setOnLoadCallback(drawWeekChart);

    function drawWeekChart() {
      var data = google.visualization.arrayToDataTable([
        ['Week', 'Budget', 'Expenses', 'Remaining'],
        ['Week 1', 250, 50, 200],
        ['Week 2', 250, 0, 250],
        ['Week 3', 250, 125, 125],
        ['Week 4', 250, 175, 75]
      ]);

      var options = {
        chart: {
          title: 'Weekly',
          subtitle: 'Budget, Expenses, and Remaining Amount',
        },
        bars: 'horizontal' // Required for Material Bar Charts.
      };

      var chart = new google.charts.Bar(document.getElementById('weekbarchart_material'));

      chart.draw(data, google.charts.Bar.convertOptions(options));
    }

    //monthly bar chart load and draw methods
    google.charts.load('current', {'packages':['bar']});
    google.charts.setOnLoadCallback(drawMonthChart);

    function drawMonthChart() {
      var data = google.visualization.arrayToDataTable([
        ['Month', 'Budget', 'Expenses', 'Remaining'],
        ['January', 1000, 400, 600],
        ['February', 1000, 460, 540],
        ['March', 1000, 1120, 0],
        ['April', 1000, 540, 460],
        ['May', 1000, 640, 360],
        ['June', 1000, 740, 260],
        ['July', 1000, 840, 160],
        ['August', 1000, 300, 700],
        ['September', 1000, 450, 550],
        ['October', 1000, 220, 780],
        ['November', 1000, 330, 670],
        ['December', 1000, 560, 440]
      ]);

      var options = {
        chart: {
          title: 'Monthly',
          subtitle: 'Budget, Expenses, and Remaining Amount',
        },
        bars: 'horizontal' // Required for Material Bar Charts.
      };

      var chart = new google.charts.Bar(document.getElementById('monthbarchart_material'));

      chart.draw(data, google.charts.Bar.convertOptions(options));
    }

    function displayWeeklyBudgetValues(starting, remaining) {
        $("#bd1").remove();
        $("#bd2").remove();

      var start = $("<font size=\"3\" id=\"bd1\" class=\"budgetDescription\" >Starting Weekly Budget: <b>" + starting + "</b></font>");
      var remain = $("<font size=\"3\" id=\"bd2\" class=\"budgetDescription2\" >Remaining Budget: <b>" + remaining + "</b></font>");
      $("#piechartcontainer").append(start);
      $("#piechartcontainer").append(remain);
    }
});
