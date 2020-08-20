export function convertDate(timestamp) {
  const date = new Date();
  date.setTime(timestamp * 1000);
  return (
    date.getUTCDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  );
}

export function getCurrentDatePlus(daysFromToday) {
  let newDate = new Date();
  newDate.setDate(newDate.getDate() + daysFromToday);
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  return date + "/" + month + "/" + year;
}

// Recibe una cantidad de doceavos de pastillas y lo traduce a cantidades
export function translateStock(stock) {
  let cantidad_pastillas = (stock - (stock % 12)) / 12;
  let texto_stock = "";
  if (cantidad_pastillas) {
    texto_stock = cantidad_pastillas + " comprimidos";
    switch (stock % 12) {
      case 0:
        return texto_stock;
        break;
      case 3:
        return (texto_stock = texto_stock + " y un cuarto");
        break;
      case 4:
        return (texto_stock = texto_stock + " y un tercio");
        break;
      case 6:
        return (texto_stock = texto_stock + " y medio");
        break;
      case 8:
        return (texto_stock = texto_stock + " y dos tercios");
        break;
      case 9:
        return (texto_stock = texto_stock + " y tres cuartos");
        break;
    }
  } else {
    switch (stock % 12) {
      case 0:
        return texto_stock;
        break;
      case 3:
        return (texto_stock = texto_stock + " Un cuarto de comprimido");
        break;
      case 4:
        return (texto_stock = texto_stock + " Un tercio de comprimido");
        break;
      case 6:
        return (texto_stock = texto_stock + " Medio comprimido");
        break;
      case 8:
        return (texto_stock = texto_stock + " Dos tercios de comprimido");
        break;
      case 9:
        return (texto_stock = texto_stock + " Tres cuartos de comprimido");
        break;
    }
  }
}
