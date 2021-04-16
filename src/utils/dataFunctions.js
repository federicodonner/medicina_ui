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
  let textoStock = "";
  if (cantidad_pastillas) {
    textoStock = cantidad_pastillas + " comprimidos";
    switch (stock % 12) {
      case 0:
        return textoStock;
        break;
      case 3:
        return (textoStock = textoStock + " y un cuarto");
        break;
      case 4:
        return (textoStock = textoStock + " y un tercio");
        break;
      case 6:
        return (textoStock = textoStock + " y medio");
        break;
      case 8:
        return (textoStock = textoStock + " y dos tercios");
        break;
      case 9:
        return (textoStock = textoStock + " y tres cuartos");
        break;
      default:
        return textoStock;
        break;
    }
  } else {
    switch (stock % 12) {
      case 0:
        return textoStock;
        break;
      case 3:
        return (textoStock = textoStock + " Un cuarto de comprimido");
        break;
      case 4:
        return (textoStock = textoStock + " Un tercio de comprimido");
        break;
      case 6:
        return (textoStock = textoStock + " Medio comprimido");
        break;
      case 8:
        return (textoStock = textoStock + " Dos tercios de comprimido");
        break;
      case 9:
        return (textoStock = textoStock + " Tres cuartos de comprimido");
        break;
      default:
        return textoStock;
        break;
    }
  }
}
