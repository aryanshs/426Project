import { getserviceList } from "../../index";

var data = getserviceList;

document.getElementById("NameofB").innerText(data[0].name);
