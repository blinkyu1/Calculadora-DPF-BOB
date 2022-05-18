$(document).on("click", ".simulaUm", function () {
  /* formateador */
  Number.prototype.praPessoa = function (c, d, t) {
    let n = this,
      s,
      i,
      j;
    (c = isNaN((c = Math.abs(c))) ? 2 : c),
      (d = d === undefined ? "," : d),
      (t = t === undefined ? "." : t),
      (s = n < 0 ? "-" : ""),
      (i = parseInt((n = Math.abs(+n || 0).toFixed(c))) + ""),
      (j = (j = i.length) > 3 ? j % 3 : 0);

    return (
      s +
      (j ? i.substr(0, j) + t : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
      (c
        ? d +
          Math.abs(n - i)
            .toFixed(c)
            .slice(2)
        : "")
    );
  };

  jQuery(".resultados").show();
  jQuery("html, body");

  var combo2 = document.getElementById("moneda");
  var selected2 = combo2.options[combo2.selectedIndex].text;
  var combo = document.getElementById("Plazo");
  var selected = combo.options[combo.selectedIndex].text;
  var val = [];
  let tasa = 0;
  let aux = 0;
  fetch("./js/interes.json")
    .then((respuesta) => respuesta.json())
    .then((respuesta) => {
      respuesta.forEach((element) => {
        if (element.item === selected) {
          tasa = element.valor;
        }
      });

      let monto = parseFloat(jQuery(".monto").val() * 1);

      const tipmd = selected2;
      if (tipmd == "$us.") {
        monto = monto * 6.96;
      }

      let tasaPush = tasa;

      let total = monto + monto * (tasa / 100);
      /* imprime resultados */
      jQuery(".apMont").text(Number(monto).praPessoa());
      jQuery(".apTas").text(Number(tasaPush).praPessoa());
      jQuery(".apTot").text(Number(total).praPessoa());
    });
});

Calculator = {};
Calculator.Initialize = function () {
  Calculator.AddDimensionsWall();
  Calculator.AddDimensionsDoorWindow("Window", "janela");
  Calculator.AddDimensionsDoorWindow("Door", "porta");
};
Calculator.DimensionsWallIndex = 99999;
Calculator.DimensionsDoorWindowIndex = 99999;
Calculator.Result = "";
Calculator.ShowFirstStep = function () {
  $("#divCalculatorFirstStep").show();
  $("#divCalculatorSecondStep").hide();
};
Calculator.ShowSecondStep = function () {
  $("#divCalculatorFirstStep").hide();
  $("#divCalculatorSecondStep").show();
  $("button.go-to-top").click();
};
Calculator.Change = function () {
  $("#divCalculatorFirstStep").show();
  $("#divCalculatorSecondStep").hide();
};

Calculator.Calculate_End = function (n) {
  n = n || {
    Surface: "",
    TypePaint: "",
    TotalMetersSurface: "",
    TotalMetersEnd: "",
    TotalMetersDecrease: "",
    Quantity: "",
    QuantityLargeCan: "",
    QuantityMediumCan: "",
    QuantitySmallCan: ""
  };
  Calculator.Result = n;
  $("#spanSurface").html(n.Surface);
  $("#spanProduct").html(n.TypePaint);
  $("#spanTotalMeters").html(
    String.Format("{0} m²", n.TotalMetersSurface.ToString("0.##"))
  );
  $("#spanMetersEnd").html(
    String.Format("{0} m²", n.TotalMetersEnd.ToString("0.##"))
  );
  $("#spanDimensionsDoorWindow").html(
    String.Format("{0} m²", n.TotalMetersDecrease.ToString("0.##"))
  );
  $("#spanQuantity").html(
    String.Format("{0} litros", n.Quantity.ToString("0.##"))
  );
  $("#spanQuantityPackage").html(
    String.Format("{0} lata(s)", n.QuantityLargeCan)
  );
  Calculator.ShowSecondStep();
  Calculator.Result.QuantitySmallCan == 1
    ? Calculator.ChangeTypePaintCan(3, "small-can")
    : Calculator.Result.QuantityMediumCan == 1
    ? Calculator.ChangeTypePaintCan(2, "medium-can")
    : Calculator.ChangeTypePaintCan(1, "large-can");
};
Calculator.ChangeTypePaintCan = function (n, t) {
  var i = 0;
  i =
    n == 1
      ? Calculator.Result.QuantityLargeCan
      : n == 2
      ? Calculator.Result.QuantityMediumCan
      : Calculator.Result.QuantitySmallCan;
  $("#spanQuantityPackage").html(String.Format("{0} lata(s)", i));
  $("#ulTypePaintCan li").removeClass("active");
  $("#" + t).addClass("active");
};
Calculator.Recalculate = function () {
  $("input:text").val("");
  $("input[type=radio]").removeAttr("checked");
  $("#dropTypePaint").html("");
  $("#dropHands").val("-1");
  Calculator.ShowFirstStep();
};
Calculator.GetTypePaints = function (n) {
  $("#dropTypePaint").empty();
  $("#dropTypePaint").prop("disabled", !1);
  Ajax.Callback.GetTypePaints(n, Calculator.GetTypePaints_End);
};
Calculator.GetTypePaints_End = function (n) {
  var i, t;
  for (
    n = n || {
      TypePaints: []
    },
      i = "",
      n.TypePaints.length > 1 &&
        (i += '<option value="-1">Selecione o produto</option>'),
      t = 0;
    t < n.TypePaints.length;
    t++
  )
    i += String.Format(
      '<option value="{0}">{1}</option>',
      n.TypePaints[t].Id,
      n.TypePaints[t].Name
    );
  $("#dropTypePaint").append(i);
  n.TypePaints.length <= 1 && $("#dropTypePaint").prop("disabled", "disabled");
};
