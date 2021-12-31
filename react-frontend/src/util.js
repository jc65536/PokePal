export function backend(endpoint) {
  return "http://165.232.139.19:3000/" + endpoint;
}

export function pokeapi(endpoint) {
  return "https://pokeapi.co/api/v2/" + endpoint;
}

export function toParams(json) {
  return new URLSearchParams(json).toString();
}

export function uppercase(str) {
  if (str == null) return null;
  return str.toUpperCase();
}

export function titleCase(str) {
  if (str == null) return null;
  return str.split(" ").map(w => w[0].toUpperCase() + w.substring(1).toLowerCase()).join(" ");
}

export function setTitle(str) {
  if (str == "")
    document.title = "PokePal";
  else
    document.title = "PokePal | " + str;
}
